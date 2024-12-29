"use client";

import { useAlleUserStore } from "@/store";
import { MenuIcon } from "@/svgs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

interface SheetProps{
  setActiveSheet: Dispatch<SetStateAction<boolean>>
}

const MessageHeader = ({setActiveSheet}:SheetProps) => {
  const pathname = usePathname();
  const userId = pathname.split("/")[2];
  const allusers = useAlleUserStore((state) => state.allUsers);
  const user = allusers.filter((user) => user.id === userId);
  return (
    <div className=" flex justify-between items-center p-3 bg-neutral-200 w-full">
      <div className=" flex items-center gap-2">
        <Image
          src={"/images/user.jpg"}
          alt="user"
          width={45}
          height={45}
          className=" rounded-full object-cover object-center"
        />

        <h1 className=" text-lg font-semibold line-clamp-1 capitalize">
          {user[0].name}
        </h1>
      </div>
      <button onClick={() => setActiveSheet(true)}><MenuIcon width="25" height="25"/></button>
    </div>
  );
};

export default MessageHeader;
