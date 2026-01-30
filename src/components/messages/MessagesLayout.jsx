"use client";

import { useState, useEffect } from "react";
import { dummyConversations, dummyMessages } from "@/lib/dummy-data/messages";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { cn } from "@/lib/utils";
import { useSocket } from "@/providers/socket-provider";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";

export default function MessagesLayout() {
  const [selectedId, setSelectedId] = useState(null);
  const [conversations, setConversations] = useState(dummyConversations);
  // In a real app, this would be object state or fetched query data
  // For mock UI, we'll just keep a local state of messages to simulate sending
  const [allMessages, setAllMessages] = useState(dummyMessages);

  const { socket, isConnected } = useSocket();

  // Listener for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      console.log("Socket: Received message", data);
      // Here you would update state with real data
      // For demo/mock, we just log it as requested
    };

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, handleReceiveMessage);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVE, handleReceiveMessage);
    };
  }, [socket]);

  const activeConversation = conversations.find((c) => c.id === selectedId);
  const currentMessages = selectedId ? allMessages[selectedId] || [] : [];

  const handleSendMessage = (text) => {
    if (!selectedId) return;

    // Emit to socket
    if (socket && isConnected) {
      console.log("Socket: Emitting message", text);
      socket.emit(SOCKET_EVENTS.MESSAGE_SEND, {
        conversationId: selectedId,
        text,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn(
        "Socket not connected, message likely not sent to server (mock mode only)",
      );
    }

    const newMessage = {
      id: Date.now(),
      text,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setAllMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessage],
    }));

    // Move conversation to top
    setConversations((prev) => {
      const others = prev.filter((c) => c.id !== selectedId);
      const updated = {
        ...activeConversation,
        lastMessage: text,
        timestamp: "Now",
        unread: 0,
      };
      return [updated, ...others];
    });
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] sm:h-[600px] md:h-[calc(100vh-5rem)] border rounded-lg shadow-sm overflow-hidden bg-background">
      {/* Left Panel - Conversation List */}
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        className={cn(
          "w-full md:w-[320px] lg:w-[360px] shrink-0",
          selectedId ? "hidden md:flex" : "flex",
        )}
      />

      {/* Right Panel - Chat Window */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 bg-background",
          !selectedId ? "hidden md:flex" : "flex",
        )}
      >
        <ChatWindow
          conversation={activeConversation}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
