"use client";

import { CloseIcon } from "@/svgs";
import React, { Dispatch, SetStateAction, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  acceptFriendRequest,
  checkFriendRequestExist,
  getReceivedFriendRequest,
  getSendFriendRequest,
  getUserByEmail,
  sendFriendRequest,
} from "@/actions/action.user";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { FetchData } from "@/lib/queries";
import Loader from "../loader/Loading";

interface SearchUsersProps {
  setActiveSeachUsers: Dispatch<SetStateAction<boolean>>;
}

interface FriendRequest {
  id: string;
  status: "Pending" | "Accepted" | "Rejected";
  senderId: string;
  recipientId: string;
  recipient: User | null;
  sender: User | null;
  receiverId: string;
  createdAt: Date;
}

const FormSchema = z.object({
  email: z.string().email(),
});

const SearchUsers = ({ setActiveSeachUsers }: SearchUsersProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [requestStatus, setRequestStatus] = useState("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const user = await getUserByEmail(data.email);
    if (user) {
      const exist = await checkFriendRequestExist(user!.id);
      if (exist) {
        setRequestStatus(exist?.status);
      }
      setUser(user);
      console.log(exist);
    } else {
      setUser(null);
      console.log("User not found");
    }
  }

  const { isPending: isPendingSend, data: send } = FetchData(
    ["send-request"],
    getSendFriendRequest
  ) as { isPending: boolean; data: FriendRequest[] };

  const { isPending: isPendingReceive, data: receive } = FetchData(
    ["receive-request"],
    getReceivedFriendRequest
  ) as { isPending: boolean; data: FriendRequest[] };

  return (
    <div className=" absolute inset-0 bg-white z-50">
      <div className=" flex justify-between items-center mx-2 my-4">
        <h1 className=" text-2xl font-bold">Find User</h1>
        <div
          className=" cursor-pointer ease-in-out duration-200 hover:scale-105"
          onClick={() => setActiveSeachUsers(false)}
        >
          <CloseIcon width="25" height="25" />
        </div>
      </div>
      <div className=" px-2 space-y-5">
        <Form {...form}>
          <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        {user ? (
          <SearchUserCard type="SEARCH" user={user} status={requestStatus} senderId="" recipientId="" />
        ) : (
          form.getValues("email") && (
            <div className=" w-full pt-5 text-center">No user found</div>
          )
        )}
        <Loader state={isPendingSend} color="black">
          {send && send.length > 0 && (
            <div>
              <h1 className=" font-semibold">Send requests</h1>
              <div>
                {send.map((user) => (
                  <SearchUserCard
                    type="SENDER"
                    user={user.recipient}
                    status={user.status}
                    key={user.id}
                    senderId=""
                    recipientId=""
                  />
                ))}
              </div>
            </div>
          )}
        </Loader>

        <Loader state={isPendingReceive} color="black">
          {receive && receive.length > 0 && (
            <div>
              <h1 className=" font-semibold">Receive requests</h1>
              <div>
                {receive.map((user) => (
                  <SearchUserCard
                    type="RECEIVER"
                    user={user.sender}
                    status={user.status}
                    key={user.id}
                    senderId={user.senderId}
                    recipientId={user.recipientId}
                  />
                ))}
              </div>
            </div>
          )}
        </Loader>
      </div>
    </div>
  );
};

export default SearchUsers;

interface SearchUserCardProps {
  user: User | null;
  status: string;
  type: "SENDER" | "RECEIVER" | "SEARCH";
  senderId: string;
  recipientId: string;
}

const SearchUserCard = ({ user, status, type, senderId, recipientId }: SearchUserCardProps) => {
  const handleSendFriendRequest = async () => {
    if (user) {
      const x = await sendFriendRequest(user);
      console.log(x);
    }
  };

  const handleAcceptRequest = async () => {
    const accept = await acceptFriendRequest(senderId, recipientId)
    console.log(accept)
  }
  return (
    <div className=" border shadow-md p-3 space-y-5 rounded-lg">
      <div className=" flex items-center gap-3">
        <Image
          src={"/images/user.jpg"}
          alt="user"
          width={50}
          height={50}
          className=" rounded-full border"
        />
        <div className=" leading-tight">
          <h1 className=" text-lg font-semibold capitalize">{user?.name}</h1>
          <p className=" text-xs">{user?.email}</p>
        </div>
      </div>
      <div className=" w-full">
        {type === "SEARCH" && (
          <Button
            disabled={!!status}
            className=" w-full"
            onClick={() => handleSendFriendRequest()}
          >
            {status === "Pending" ? "Request sended" : "Send Request"}
          </Button>
        )}
        {
          type === 'RECEIVER' && 
          <Button
          className=" w-full"
          onClick={() => handleAcceptRequest()}
        >
          {status === "Pending" ? "Accept request" : "Send Request"}
        </Button>
        }
      </div>
    </div>
  );
};
