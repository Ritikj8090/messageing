"use client";

import MenuSidebar from "@/components/global/menu/MenuSidebar";
import useSocket from "@/hooks/useSocket";
import { useAlleUserStore, useUserStore } from "@/store";
import React, { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const currentUser = useUserStore((state) => state.currentUser);
  const allUsers = useAlleUserStore((state) => state.allUsers);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    if (currentUser) {
      socket.emit("register", currentUser.id);
    }
  }, [socket, currentUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("online", (users: { [id: string]: string }) => {
      allUsers.map((user) => {
        if (users[user.id]) {
          user.emailVerified = true;
        }
        return user;
      });
    });
  }, [socket, allUsers]);

  return (
    <div className=" flex min-h-screen">
      <MenuSidebar />
      {children}
    </div>
  );
};

export default Layout;
