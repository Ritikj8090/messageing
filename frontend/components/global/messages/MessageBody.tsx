"use client";

import useSocket from "@/hooks/useSocket";
import { cn } from "@/lib/utils";
import { useMessageStore, useUserStore } from "@/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MessageBody = () => {
  const pathname = usePathname();
  const userId = pathname.split("/")[2];
  const socket = useSocket();
  const currentUser = useUserStore((state) => state.currentUser);
  const allMessages = useMessageStore((state) => state.messages);
  const updateMessages = useMessageStore((state) => state.updateMessages);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "receiver",
      (msg: { senderId: string; message: string; createdAt: Date }) => {
        updateMessages({ id: userId, messages: msg });
      }
    );

    // Cleanup on unmount
    return () => {
      socket.off("message");
    };
  }, [socket, currentUser, updateMessages, userId]);

  return (
    <div id="message-body" className="overflow-y-auto w-full ">
      <div className=" w-full py-3 space-y-3 px-2">
        {allMessages.length > 0 ? (
          allMessages
            .filter((messages) => messages.id === userId)[0]
            .messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  " flex",
                  message.senderId === currentUser!.id
                    ? "justify-end"
                    : "justify-start"
                )}
              >
                <span className="bg-blue-500 text-white py-2 px-3 rounded-md ">
                  {message.message}
                </span>
              </div>
            ))
        ) : (
          <div className=" text-center">No messages</div>
        )}
      </div>
    </div>
  );
};

export default MessageBody;
