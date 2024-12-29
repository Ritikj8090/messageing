"use client";

import { useState } from "react";
import ChatSidebar from "../user/ChatSidebar";
import Loader from "../loader/Loading";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { AddIcon, MenuIcon } from "@/svgs";
import { Separator } from "@/components/ui/separator";
import SearchUsers from "../search/SearchUsers";

const Sidebar = ({isPending, data}:{isPending:boolean, data:User[]} ) => {
  const pathname = usePathname();
  const userId = pathname.split("/")[2];
  const [activeChat, setActiveChat] = useState(userId);
  const [activeSeachUsers, setActiveSeachUsers] = useState(false)

  return (
    <div className=" min-w-[250px] border-r relative">
      <div className=" flex justify-between items-center mx-2 my-4">
        <h1 className=" text-2xl font-bold">Chats</h1>
        <div className=" flex items-center gap-2">
          <button onClick={() => setActiveSeachUsers(!activeSeachUsers)}><AddIcon width="25" height="25" /></button>
          <button><MenuIcon width="25" height="25"/></button>
        </div>
      </div>
      <Loader state={isPending} color="black">
      <div> 
        {data.map((chat) => (
          <div key={chat.id}>
            <ChatSidebar
            id={chat.id}
            name={chat.name || ''}
            last_message={"ll"}
            date_and_time={chat.createdAt}
            profileUrl={chat.profileUrl || '/images/user.jpg'}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            onlineStatus={chat.emailVerified}
          />
          <div className="flex items-center justify-center">
          <Separator className="w-[80%]"/>

          </div>
          </div>
        ))}
      </div>
      </Loader>
      {activeSeachUsers && <SearchUsers setActiveSeachUsers={setActiveSeachUsers} />}
    </div>
  );
};

export default Sidebar;
