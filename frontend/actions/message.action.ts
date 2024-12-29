"use server";

import prisma from "@/lib/prisma";
import { InputJsonValue } from "@prisma/client/runtime/library";

interface storeSendMessagesProps {
  from: string;
  to: string;
  message: string;
}

export const storeSendMessages = async ({
  ...props
}: storeSendMessagesProps) => {
  try {
    const existingConversation = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: props.from, receiverId: props.to },
          { senderId: props.to, receiverId: props.from },
        ],
      },
    });

    const messageWithSenderId: InputJsonValue = {
      senderId: props.from,
      message: props.message,
      createAt: new Date(),
    };

    if (!!existingConversation.length) {
      const updatedMessages: InputJsonValue[] = [
        ...(existingConversation[0].messsage as InputJsonValue[]),
        messageWithSenderId,
      ];

      return await prisma.message.updateMany({
        where: {
          OR: [
            { senderId: props.from, receiverId: props.to },
            { senderId: props.to, receiverId: props.from },
          ],
        },
        data: {
          messsage: updatedMessages,
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        senderId: props.from,
        receiverId: props.to,
        messsage: [messageWithSenderId],
      },
    });
    return message;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getMessages = async (senderId: string, receiverId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId:senderId, receiverId:receiverId },
          { receiverId:senderId, senderId:receiverId },
        ],
      },
      select:{
        messsage: true,
      }
    });
    if(messages.length <= 0)
        return JSON.stringify([])
    return JSON.stringify(messages[0].messsage)
  } catch (error) {
    console.log(error)
    throw new Error((error as Error).message);
  }
};
