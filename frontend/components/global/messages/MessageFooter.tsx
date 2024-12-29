"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {useMessageStore, useUserStore} from "@/store";
import useSocket from "@/hooks/useSocket";
import { usePathname } from "next/navigation";
import { storeSendMessages } from "@/actions/message.action";

const FormSchema = z.object({
  message: z.string().min(1),
});

const MessageFooter = () => {
  const socket = useSocket();
  const currentUser = useUserStore((state) => state.currentUser);
  const updateMessages = useMessageStore((state) => state.updateMessages);
  const pathname = usePathname();
  const userId = pathname.split("/")[2];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });
 
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const messageWithSenderId = {
      from: currentUser!.id,
      to: userId,
      message: data.message,
      createdAt: new Date()
    };

    const senderMessage = {
      senderId: currentUser!.id, message: data.message, createdAt: new Date()
    }
    socket.emit("sender", messageWithSenderId);
    updateMessages({id:userId, messages:senderMessage});
    form.setValue("message", "");
    await storeSendMessages(messageWithSenderId);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex gap-3 mb-3 mx-3"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormControl>
                <Input
                  className="rounded-full italic bg-neutral-50"
                  placeholder="Type your message."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Send</Button>
      </form>
    </Form>
  );
};

export default MessageFooter;
