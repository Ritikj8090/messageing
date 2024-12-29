"use client";

import Link from "next/link";
import React, { useState } from "react";
import { MenuSidebarItems } from "@/constant";
import { cn } from "@/lib/utils";

const MenuSidebar = () => {
  const [activeMenu, setActiveMenu] = useState("/chat");
  return (
    <div className=" w-[70px] border-r p-3 flex flex-col justify-between">
      <div className=" flex flex-col justify-center items-center space-y-5">
        {MenuSidebarItems.slice(0, 3).map((item) => (
          <Link
            onClick={() => setActiveMenu(item.link)}
            href={item.link}
            key={item.link}
            className={cn(
              " p-2 rounded-xl",
              activeMenu === item.link
                ? "bg-black"
                : "bg-white hover:bg-neutral-300"
            )}
          >
            {item.icons({
              width: "25",
              height: "25",
              color: activeMenu === item.link ? "white" : "black",
            })}
          </Link>
        ))}
      </div>
      <div className=" flex flex-col justify-center items-center space-y-5">
        {MenuSidebarItems.slice(3).map((item) => (
          <Link
            onClick={() => setActiveMenu(item.link)}
            href={item.link}
            key={item.link}
            className={cn(
              " p-2 rounded-xl",
              activeMenu === item.link
                ? "bg-black"
                : "bg-white hover:bg-neutral-300"
            )}
          >
            {item.icons({
              width: "25",
              height: "25",
              color: activeMenu === item.link ? "white" : "black",
            })}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuSidebar;
