"use client";

import { CallSidebar } from "@/components/global/menu/CallSidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {

  return (
    <div className=" w-full min-h-screen flex">
      <CallSidebar />
      {children}
    </div>
  );
};

export default Layout;
