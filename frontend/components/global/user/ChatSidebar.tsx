import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

interface ChatSidebarProps {
  id: string;
  name: string;
  last_message: string;
  date_and_time: Date;
  profileUrl: string;
  activeChat: string;
  setActiveChat: Dispatch<SetStateAction<string>>;
  onlineStatus: boolean;
}

const ChatSidebar = ({
  id,
  name,
  last_message,
  date_and_time,
  profileUrl,
  activeChat,
  setActiveChat,
  onlineStatus,
}: ChatSidebarProps) => {
  return (
    <Link
      href={`/chat/${id}`}
      className={cn(
        "w-full flex gap-2 items-center cursor-pointer p-3",
        activeChat === id ? " bg-neutral-200" : "hover:bg-neutral-100"
      )}
      onClick={() => setActiveChat(id)}
    >
      <div className=" relative">
        <Image
          src={profileUrl}
          alt="profile"
          width={70}
          height={70}
          className=" rounded-full border"
        />
        <span className={cn('z-10 rounded-full border h-3 w-3 absolute right-0 bottom-2', onlineStatus ? 'bg-green-500' : 'bg-red-500')} />
      </div>
      <div className=" w-full leading-tight">
        <div className=" flex justify-between w-full">
          <h1 className=" font-semibold line-clamp-1">{name}</h1>
          <span className=" text-xs">{formatDate(date_and_time)}</span>
        </div>
        <p className=" text-sm line-clamp-1">{last_message}</p>
      </div>
    </Link>
  );
};

export default ChatSidebar;
