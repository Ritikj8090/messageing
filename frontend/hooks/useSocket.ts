import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null; // Singleton instance

const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      // Initialize the socket if it doesn't exist
      socket = io("http://localhost:3001"); // Backend server URL
    }

    setSocketInstance(socket);

    // Cleanup on component unmount
    return () => {
      // Disconnect socket only if no components are using it
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  return socketInstance!;
};

export default useSocket;
