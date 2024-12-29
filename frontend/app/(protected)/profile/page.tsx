"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {useUserStore} from "@/store";
import Loader from "@/components/global/loader/Loading";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  status: z
    .string()
    .min(1, { message: "min 1" })
    .max(100, { message: "max 100" }),
});

const Page = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || "", // Update default values
        email: currentUser.email || "",
      });
    }
  }, [currentUser, form]); // Trigger reset when currentUser changes

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Loader state={!!!currentUser} color="black">
      <div className=" w-full min-h-screen">
        <div className=" mx-3 my-4">
          <h1 className=" text-2xl font-bold">Profile</h1>
        </div>
        <div className=" w-full flex flex-col items-center space-y-5">
          <div className=" w-full flex flex-col items-center">
            <Image
              src={"/images/user.jpg"}
              alt="profile"
              width={200}
              height={200}
              className=" rounded-full border"
            />
          </div>
          <div className=" w-1/2 space-y-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          rows={1}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" w-full">

                <Button type="submit" className=" w-full">Update</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Loader>
  );
};

export default Page;
