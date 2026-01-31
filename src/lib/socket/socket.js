import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

/**
 * Creates and returns a new Socket.IO client instance.
 * @returns {import("socket.io-client").Socket}
 */
export const createSocketConnection = () => {
    return io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: false, // We will connect manually when authenticated
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });
};
