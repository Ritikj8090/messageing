import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken'
import { User } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateToken = (user:User) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "12h",
    }
  );
  return token;
}

export const formatDate = (date: Date): string => {
  const now = new Date();
  const targetDate = new Date(date); // Assume `date` is already a valid Date object

  // Calculate the difference in days
  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
  const diffDays = Math.floor((now.getTime() - targetDate.getTime()) / oneDay);

  // Define a function to format time with AM/PM
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Check if it's today or yesterday
  if (diffDays === 0) {
    return `${formatTime(targetDate)}`;
  } else if (diffDays === 1) {
    return `Yesterday`;
  } else {
    // Return date in MM/DD/YYYY, HH:MM AM/PM format
    return `${targetDate.toLocaleDateString()}`;
  }
};

