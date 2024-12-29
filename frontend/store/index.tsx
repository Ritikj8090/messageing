import { User } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  currentUser: User | null; // null if no user is logged in
  setCurrentUser: (user: User) => void; // function to set the current user
  clearUser: () => void; // function to clear the user
}

interface MessagesProps {
  senderId: string;
  message: string;
  createdAt: Date;
}

interface MessagesState {
  messages: {
    id: string;
    messages: MessagesProps[];
  }[];
  setMessages: (messages: { id: string; messages: MessagesProps[] }[]) => void;
  updateMessages: (messages: { id: string; messages: MessagesProps }) => void;
}

interface AllUsersState {
  allUsers: User[];
  setAllUsers: (allUsers: User[]) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: "user-store",
      storage: {
        getItem: (key) => {
          const storedValue = sessionStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (key, value) => {
          sessionStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          sessionStorage.removeItem(key);
        },
      },
    }
  )
);

const useAlleUserStore = create<AllUsersState>()(
  persist(
    (set) => ({
      allUsers: [],
      setAllUsers: (allUsers: User[]) =>
        set({
          allUsers: allUsers,
        }),
    }),
    {
      name: "all-users-store",
      storage: {
        getItem: (key) => {
          const storedValue = sessionStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (key, value) => {
          sessionStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          sessionStorage.removeItem(key);
        },
      },
    }
  )
);

const useMessageStore = create<MessagesState>()(
  persist(
    (set) => ({
      messages: [],
      setMessages: (messages) => set({ messages: messages }),
      updateMessages: (message) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === message.id
              ? { ...msg, messages: [...msg.messages, message.messages] }
              : msg
          ),
        })),
    }),
    {
      name: "messages-store",
      storage: {
        getItem: (key) => {
          const storedValue = sessionStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (key, value) => {
          sessionStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          sessionStorage.removeItem(key);
        },
      },
    }
  )
);

export { useUserStore, useAlleUserStore, useMessageStore };
