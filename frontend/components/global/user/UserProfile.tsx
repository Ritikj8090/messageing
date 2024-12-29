"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { User } from "@prisma/client";
import Loader from "../loader/Loading";
import { Button } from "@/components/ui/button";
import { unfriend } from "@/actions/action.user";

interface UserProfileProps {
  width: number;
  setWidth: Dispatch<SetStateAction<number>>;
  activeSheet: boolean;
  setActiveSheet: Dispatch<SetStateAction<boolean>>;
  isPending: boolean;
  data: User;
}

const UserProfile = ({
  width,
  setActiveSheet,
  setWidth,
  activeSheet,
  isPending,
  data,
}: UserProfileProps) => {
  useEffect(() => {
    const updateWidth = () => {
      const width = document
        .getElementById("message-body")
        ?.getBoundingClientRect().width;
      if (width) {
        setWidth(width);
      }
    };
    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [activeSheet, setWidth]);

  const handleUnfriend = async () => {
    const friend = await unfriend(data.id);
    console.log(friend);
  };

  return (
    <Sheet open={activeSheet} onOpenChange={(isOpen) => setActiveSheet(isOpen)}>
      <SheetContent style={{ minWidth: `${width}px` }}>
        <Loader
          state={isPending}
          color="black"
          className=" flex items-center justify-center h-full"
        >
          <SheetHeader>
            <SheetTitle>User Profile</SheetTitle>
          </SheetHeader>
          {data && (
            <div className=" text-black flex justify-center flex-col items-center space-y-5 text-lg">
              <div>
                <Image
                  src={"/images/user.jpg"}
                  alt="user"
                  width={100}
                  height={100}
                  className=" rounded-full border"
                />
              </div>
              <div className="w-1/2">
                <div className=" flex items-center gap-1">
                  <span>Name:-</span>
                  <p>{data.name}</p>
                </div>
                <div className=" flex items-center gap-1">
                  <span>Email:-</span>
                  <p>{data.email}</p>
                </div>
              </div>
              <div>
                <Button onClick={() => handleUnfriend()}>Unfriend</Button>
              </div>
            </div>
          )}
        </Loader>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;
