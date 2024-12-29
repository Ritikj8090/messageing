"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/utils";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) {
    throw new Error("User is not authenticated");
  }

  // Decode the token
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JWTUserProps;

  return decoded;
};

export const createUser = async ({ ...props }: createUserProps) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: props.email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(props.password, salt);

    const user = await prisma.user.create({
      data: {
        name: props.name,
        email: props.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = generateToken(user);
    return { user, token };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const signIn = async ({ ...props }: signInProps) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: props.email.toLowerCase(),
      },
    });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(props.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    const token = generateToken(user);

    return { user, token };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getAllUser = async () => {
  try {
    const currentUser = await getCurrentUser();

    return await prisma.user.findMany({
      where: {
        id: { not: currentUser.id },
      },
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const checkFriendRequestExist = async (id: string) => {
  const currentUser = await getCurrentUser();

  const existingRequest = await prisma.friendRequest.findMany({
    where: {
      senderId: currentUser.id,
      recipientId: id,
    },
    include: {
      sender: true,
      recipient: true,
    },
  });
  if (existingRequest.length > 0) return existingRequest[0];

  return null;
};

export const sendFriendRequest = async (user: User) => {
  try {
    const currentUser = await getCurrentUser();

    const existingRequest = await checkFriendRequestExist(user.id);

    if (existingRequest) return existingRequest;

    const friend = await prisma.friendRequest.create({
      data: {
        senderId: currentUser.id,
        recipientId: user.id,
      },
    });
    return friend;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getSendFriendRequest = async () => {
  try {
    const currentUser = await getCurrentUser();

    const requests = await prisma.friendRequest.findMany({
      where: {
        senderId: currentUser.id,
      },
      include: {
        recipient: true,
      },
    });

    return requests;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getReceivedFriendRequest = async () => {
  try {
    const currentUser = await getCurrentUser();

    const requests = await prisma.friendRequest.findMany({
      where: {
        recipientId: currentUser.id,
      },
      include: {
        sender: true,
      },
    });

    return requests;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const acceptFriendRequest = async (
  senderId: string,
  recipientId: string
) => {
  try {
    const accept = await prisma.friends.create({
      data: {
        userId: senderId,
        friendId: recipientId,
      },
    });

    if (accept) {
      await prisma.friendRequest.deleteMany({
        where: {
          senderId: senderId,
          recipientId: recipientId,
        },
      });
    }

    return accept;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getFriendList = async () => {
  try {
    const currentUser = await getCurrentUser();

    const friends = await prisma.friends.findMany({
      where: {
        OR: [{ userId: currentUser.id }, { friendId: currentUser.id }],
      },
      include:{
        user:true,
        friend:true
      }
    });
    return friends;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const unfriend = async (friendId:string) => {
  try {
    const currentUser = await getCurrentUser();

    const friend = await prisma.friends.deleteMany({
      where:{
        OR:[
          {userId:currentUser.id, friendId:friendId},
          {userId:friendId, friendId:currentUser.id},
        ]
      }
    })
    return friend;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}