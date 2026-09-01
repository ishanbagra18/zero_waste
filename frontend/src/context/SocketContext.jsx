import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { playNotificationSound } from "../utils/notificationSound";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";
    const socketUrl = apiBase.replace(/\/api\/?$/, "");

    const newSocket = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    const emitAddUser = () => {
      if (userId) {
        newSocket.emit("addUser", userId);
        console.log("👤 Emitted addUser for userId:", userId, "on socket:", newSocket.id);
      }
    };

    newSocket.on("connect", () => {
      console.log("🟢 Socket connected:", newSocket.id);
      emitAddUser();
    });

    if (newSocket.connected) {
      emitAddUser();
    }

    newSocket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    // Play notification sound on incoming socket messages and notifications
    newSocket.on("getMessage", (incomingMsg) => {
      const senderIdStr = typeof incomingMsg?.senderId === 'object' 
        ? incomingMsg.senderId?._id?.toString() 
        : incomingMsg?.senderId?.toString();

      if (senderIdStr !== userId?.toString()) {
        playNotificationSound();
      }
    });

    newSocket.on("newNotification", (notificationData) => {
      console.log("🔔 Global real-time newNotification received:", notificationData);
      playNotificationSound();
      if (notificationData?.message) {
        toast.success(`🔔 ${notificationData.message}`, {
          duration: 5000,
        });
      }
    });

    return () => {
      newSocket.off("getMessage");
      newSocket.off("newNotification");
      newSocket.off("getUsers");
      newSocket.off("connect");
      newSocket.close();
      setSocket(null);
    };
  }, [isAuthenticated, userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
