"use client";

import { useState, useEffect } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { cn } from "@/lib/utils";
import { useSocket } from "@/providers/socket-provider";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function MessagesLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize state from URL if present
  const initialId = searchParams.get("conversationId");
  const [selectedId, setSelectedId] = useState(initialId);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id; // Robust ID check

  const { socket, isConnected } = useSocket();

  // Sync URL with selectedId
  const handleSelectConversation = (id) => {
    setSelectedId(id);
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set("conversationId", id);
    } else {
      params.delete("conversationId");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      console.log("Fetching conversations for user:", userId);
      try {
        const { data } = await api.get("/messages/get-conversations");
        console.log("Conversations response:", data);

        // Backend returns: { success: true, data: [...] } where data items have { conversationId, withUser, lastMessage, ... }
        if (data.success) {
          const mappedConvs = data.data.map((c) => ({
            id: c.conversationId,
            name: c.withUser?.fullName || "Chat",
            avatar: c.withUser?.profileImage || c.withUser?.avatar,
            lastMessage: c.lastMessage || "No messages yet",
            timestamp: c.lastMessageAt || c.createdAt,
            unread: c.unreadCount || 0,
            online: false,
          }));
          setConversations(mappedConvs);

          // If URL has ID but state doesn't (or mismatch), ensure sync
          if (initialId && conversations.length === 0) {
            // We can't validate safely here without conversations loaded, but strictly we assume URL is correct-ish
            // Optimization: check if ID exists in fetched list?
            const exists = mappedConvs.find((c) => c.id === initialId);
            if (exists) setSelectedId(initialId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    if (userId) {
      fetchConversations();
    }
  }, [userId, initialId]); // Add initialId dependency? No, mostly userId.

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedId) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(
          `/messages/get-messages-history/${selectedId}`,
        );
        if (data.success) {
          // Backend returns flattened messages
          setMessages(
            data.data.map((m) => ({
              id: m._id,
              text: m.content,
              sender:
                m.senderId === userId || m.senderId?._id === userId
                  ? "me"
                  : "them",
              timestamp: m.createdAt,
              senderDetails: m.senderId,
            })),
          );

          // Mark as seen in backend
          await api.put(`/messages/mark-seen/${selectedId}`);

          // Update local unread count to 0
          setConversations((prev) =>
            prev.map((c) => (c.id === selectedId ? { ...c, unread: 0 } : c)),
          );
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedId, userId]);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      // Prevent echo: If I sent it, ignore the socket event (since optimistic update handled it)
      const isMyMessage =
        data.senderId === userId ||
        data.senderId?._id === userId ||
        data.sender === userId;

      if (isMyMessage) return;

      // Update messages if we are successfully viewing the conversation
      if (selectedId && data.conversationId === selectedId) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.tempId || Date.now(),
            text: data.text || data.content,
            sender: "them",
            timestamp: data.createdAt || new Date().toISOString(),
          },
        ]);

        // Mark as seen immediately if we are viewing it?
        // Maybe optional step here for real-time seen, but let's rely on open-action for now.
        // Or trigger api.put mark-seen again?
        api.put(`/messages/mark-seen/${selectedId}`);
      }

      // Update conversations list (bump to top)
      setConversations((prev) => {
        const conversationIndex = prev.findIndex(
          (c) => c.id === data.conversationId,
        );
        if (conversationIndex === -1) {
          // In a real app we might want to re-fetch to get full metadata for new convo
          return prev;
        }

        const updatedConvo = { ...prev[conversationIndex] };
        updatedConvo.lastMessage = data.text || data.content;
        updatedConvo.timestamp = new Date().toISOString();
        if (data.conversationId !== selectedId) {
          updatedConvo.unread = (updatedConvo.unread || 0) + 1;
        }

        const others = prev.filter((_, i) => i !== conversationIndex);
        return [updatedConvo, ...others];
      });
    };

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, handleReceiveMessage);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVE, handleReceiveMessage);
    };
  }, [socket, selectedId, userId]);

  const activeConversation = conversations.find((c) => c.id === selectedId);

  const handleSendMessage = async (text) => {
    if (!selectedId) return;

    // Optimistic update
    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      text,
      sender: "me",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Update conversation list optimistically
    setConversations((prev) => {
      const conversationIndex = prev.findIndex((c) => c.id === selectedId);
      if (conversationIndex === -1) return prev;

      const updatedConvo = { ...prev[conversationIndex] };
      updatedConvo.lastMessage = text;
      updatedConvo.timestamp = new Date().toISOString();

      const others = prev.filter((_, i) => i !== conversationIndex);
      return [updatedConvo, ...others];
    });

    try {
      // Send via API
      await api.post("/messages/create-message", {
        conversationId: selectedId,
        content: text, // Backend expects 'content' or 'text'? Frontend api used text, let's allow content
        text, // sending both to be safe or check api. Actually api/messages.js maps text->content. But here we use raw api.
      });

      // Also emit socket event for immediate feedback
      if (socket && isConnected) {
        socket.emit(SOCKET_EVENTS.MESSAGE_SEND, {
          conversationId: selectedId,
          text,
          senderId: userId, // CRITICAL: Send ID so we can identify echo
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] sm:h-[600px] md:h-[calc(100vh-5rem)] border rounded-lg shadow-sm overflow-hidden bg-background">
      {/* DEBUG PANEL - Hidden now */}
      {/* <div className="bg-yellow-100 p-2 text-xs text-black border-b block break-all">
        UserID: {userId} | Convs: {conversations.length} | Socket:{" "}
        {isConnected ? "Connected" : "Disconnected"}
        <br />
        UserObj: {user ? JSON.stringify(user) : "NULL"}
        {conversations.length === 0 && <span> (No conversations found)</span>}
      </div> */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Conversation List */}
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
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
            messages={messages}
            currentUserId={user?._id}
            onSendMessage={handleSendMessage}
            onBack={() => handleSelectConversation(null)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
