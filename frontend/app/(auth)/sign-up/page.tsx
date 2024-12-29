"use client";

import Image from "next/image";
import React from "react";
import signUp from "@/public/images/sign-up.jpg";
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
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { createUser } from "@/actions/action.user";
import { useRouter } from "next/navigation";
import {useUserStore} from "@/store";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const SignUp = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const {user, token } = await createUser(values);
      setCurrentUser(user)
      document.cookie = `auth=${token}; path=/;`
      router.push('/')
    } catch (error) {
      console.log((error as Error).message)
    }
  };

  return (
    <div className=" w-full min-h-screen flex">
      <div className=" w-1/2">
        <Image
          src={signUp}
          alt="sign-up"
          className=" h-full w-full object-cover"
        />
      </div>
      <div className=" w-1/2 flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-[90%] lg:max-w-[60%] rounded-lg px-5 py-10 shadow-xl border"
          >
            <h1 className=" text-center text-2xl font-semibold">Sign Up</h1>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Name</FormLabel>
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
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className=" w-full font-semibold bg-blue-400 hover:bg-blue-500"
              type="submit"
            >
              Sign Up
            </Button>
            <div className=" flex items-center justify-center overflow-hidden gap-2 text-sm font-semibold">
              <Separator />
              <span>OR</span>
              <Separator />
            </div>
            <div className="text-sm flex gap-1 items-center justify-center">

            <p className=" ">Already have an account?</p>
            <Link href={'/sign-in'} className=" text-blue-600 hover:text-blue-700 underline">Sign In</Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
