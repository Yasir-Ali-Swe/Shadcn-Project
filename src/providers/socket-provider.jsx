"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "@/lib/socket/socket";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";

const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Only connect if authenticated and user has an allowed role
    const shouldConnect =
      isAuthenticated && user && (role === "lawyer" || role === "client");

    if (shouldConnect) {
      if (!socketRef.current) {
        socketRef.current = createSocketConnection();

        const socket = socketRef.current;

        socket.on(SOCKET_EVENTS.CONNECT, () => {
          console.log("Socket connected:", socket.id);
          setIsConnected(true);
        });

        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
          console.log("Socket disconnected");
          setIsConnected(false);
        });

        socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
          console.error("Socket connection error:", err);
        });

        // Debug listener
        socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, (data) => {
          console.log("New message received:", data);
        });
      }

      const socket = socketRef.current;
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      // Disconnect if conditions are not met
      if (socketRef.current) {
        console.log("Disconnecting socket (cleanup or logout)...");
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        // We only disconnect on unmount, or let the dependency change handle it (re-run effect)
        // If we disconnect here, re-renders might cause flicker if dependencies didn't change genuinely.
        // But with strict mode, we should be careful.
        // For now, let's rely on the dependency check logic above mostly.
        // But if the component effectively unmounts (logout/navigation away from provider), we must clean up.
        // Since this provider wraps Dashboard, navigating away from Dashboard unmounts it.
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, role, user]); // Re-run if auth state changes

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
