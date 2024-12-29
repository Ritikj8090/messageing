"use client";

import { getCurrentUser, getFriendList } from "@/actions/action.user";
import { getMessages } from "@/actions/message.action";
import Loader from "@/components/global/loader/Loading";
import Sidebar from "@/components/global/menu/ChatSidebar";
import { FetchData } from "@/lib/queries";
import { useAlleUserStore, useMessageStore, useUserStore } from "@/store";
import { Friends, User } from "@prisma/client";
import React, { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

interface FriendsProps extends Friends {
  friend: User;
  user: User
}

const arrangeFriendLit = async (friends:FriendsProps[]) => {
  const friendsList:User[] = []
  const currentUser = await getCurrentUser()
  friends.forEach((friend) => {
    if(friend.userId === currentUser.id){
      friendsList.push(friend.friend)
    }
    else{
      friendsList.push(friend.user)
    }
  })
  return friendsList
}

const Layout = ({ children }: Props) => {
  const currentUser = useUserStore((state) => state.currentUser);
  const allUsers = useAlleUserStore((state) => state.allUsers);
  const setAllUsers = useAlleUserStore((state) => state.setAllUsers);
  const setMessages = useMessageStore((state) => state.setMessages);

  const { isPending, data } = FetchData(["friends"], getFriendList) as {
    isPending: boolean;
    data: FriendsProps[];
  };

  useEffect(() => {
    if (data) {
      const fetchMessages = async () => {
        const list = await arrangeFriendLit(data);
        setAllUsers(list)
        const allMessages = await Promise.all(
          list.map(async (list) => {
            const messages = JSON.parse(
              await getMessages(currentUser!.id, list.id)
            );
            return { id: list.id, messages: messages };
          })
        ); 
        setMessages(allMessages);
      };
      fetchMessages();
    }
  }, [currentUser, data, setMessages, setAllUsers]);

  return (
    <Loader state={isPending} color="black">
      <div className=" w-full min-h-screen flex">
        <Sidebar isPending={false} data={allUsers} />
        {children}
      </div>
    </Loader>
  );
};

export default Layout;
