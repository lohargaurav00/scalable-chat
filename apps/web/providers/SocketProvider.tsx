"use client";
import React, { createContext, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
  sendMessage: (msg: string) => void;
  messages: Message[];
}

export const SocketContext = createContext<ISocketContext | null>(null);

type SocketProviderProps = {
  children: React.ReactNode;
};

type Message = {
  id: Socket["id"];
  message: string;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket | undefined>(undefined);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg: string) => {
      if (socket) {
        socket.emit("event:message", { id: socket.id, message: msg });
      }
    },
    [socket]
  );

  const handleMessages = useCallback(
    (msg: Message) => {
      if ((socket && msg.id === socket.id) || msg.message === "") {
        return;
      }
      if (msg) {
        setMessages((prev) => [...prev, msg]);
      }
    },
    [socket]
  );

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("messages", handleMessages);
    setSocket(_socket);

    return () => {
      _socket.off("messages");
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
