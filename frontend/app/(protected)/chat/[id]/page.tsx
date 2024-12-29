"use client";

import MessageBody from "@/components/global/messages/MessageBody";
import MessageFooter from "@/components/global/messages/MessageFooter";
import MessageHeader from "@/components/global/messages/MessageHeader";
import { useState } from "react";

import UserProfile from "@/components/global/user/UserProfile";
import { FetchData } from "@/lib/queries";
import { getUserById } from "@/actions/action.user";
import { usePathname } from "next/navigation";
import { User } from "@prisma/client";

const Page = () => {
  const pathname = usePathname()
  const userId = pathname.split("/")[2]

  const [activeSheet, setActiveSheet] = useState(false);
  const [width, setWidth] = useState<number>(0);

  const getUser = async () => {
    return await getUserById(userId)
  }
  const {isPending, data} = FetchData(['user'], getUser) as {isPending:boolean, data: User}

  return (
    <div className="w-full h-screen justify-between flex flex-col relative">
      <MessageHeader setActiveSheet={setActiveSheet} />
      <MessageBody />
      <MessageFooter />
      <UserProfile activeSheet={activeSheet}setActiveSheet={setActiveSheet} width={width} setWidth={setWidth} isPending={isPending} data={data} />
    </div> 
  );
};

export default Page;
