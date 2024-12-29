import { cn } from "@/lib/utils";
import React from "react";
import { Spinner } from "./spinner";

interface Props {
  state: boolean;
  className?: string;
  children: React.ReactNode;
  color?: string;
}

const Loader = ({ state, children, className, color }: Props) => {
  return state ? (
    <div
      className={cn(
        " w-full flex justify-center items-center",
        className
      )}
    >
      <Spinner color={color} />
    </div>
  ) : (
    children
  );
};

export default Loader;
