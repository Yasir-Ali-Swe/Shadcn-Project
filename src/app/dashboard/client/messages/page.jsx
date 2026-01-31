"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/lib/api/messages";
import { useSocket } from "@/providers/socket-provider";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

import { useSelector } from "react-redux";

export default function ClientMessagesPage() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialConversationId = searchParams.get("conversationId");

  const [selectedId, setSelectedId] = useState(null);

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
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  // 1. Fetch Conversations
  const { data: convData, isLoading: loadingConvs } = useQuery({
    queryKey: ["conversations"],
    queryFn: messagesApi.getConversations,
  });

  const conversations = convData?.data || [];

  // Effect to handle initial selection from URL
  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      // Verify it exists in the list (optional, but good for safety)
      const exists = conversations.find(
        (c) => c.conversationId === initialConversationId,
      );
      if (exists) {
        setSelectedId(initialConversationId);
      }
    }
  }, [initialConversationId, conversations]);

  // 2. Fetch Messages for selected conversation
  const { data: msgData, isLoading: loadingMsgs } = useQuery({
    queryKey: ["messages", selectedId],
    queryFn: () => messagesApi.getMessages(selectedId),
    enabled: !!selectedId,
    refetchInterval: 5000,
  });

  // Effect: Mark as seen when conversation is selected
  useEffect(() => {
    if (selectedId) {
      messagesApi
        .markSeen(selectedId)
        .then(() => {
          // Refresh conversations list to update unread count UI
          queryClient.invalidateQueries(["conversations"]);
        })
        .catch(console.error);
    }
  }, [selectedId, queryClient]);

  const messages = msgData?.data || [];

  // 3. Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: (newItem) => {
      queryClient.invalidateQueries(["messages", selectedId]);
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  // 4. Socket Listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      // Logic to check if message belongs to current focused chat
      if (selectedId && newMessage.conversationId === selectedId) {
        queryClient.invalidateQueries(["messages", selectedId]);
      }
      queryClient.invalidateQueries(["conversations"]);
    };

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, handleReceiveMessage);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVE, handleReceiveMessage);
    };
  }, [socket, selectedId, queryClient]);

  const handleSendMessage = (text) => {
    if (!selectedId) return;

    sendMutation.mutate({
      conversationId: selectedId,
      text,
    });

    if (socket && isConnected) {
      socket.emit(SOCKET_EVENTS.MESSAGE_SEND, {
        conversationId: selectedId,
        text,
        senderId: user?._id, // CRITICAL: Send ID so we can identify echo
        timestamp: new Date().toISOString(),
      });
    }
  };

  const activeConversation = conversations.find(
    (c) => c.conversationId === selectedId,
  );

  // Adapting backend data to UI components
  // Backend returns: { conversationId, withUser: { fullName, avatar, email }, lastMessage, lastMessageAt, unreadCount }
  const uiConversations = conversations.map((c) => {
    return {
      id: c.conversationId,
      name: c.withUser?.fullName || "Chat",
      avatar: c.withUser?.profileImage || c.withUser?.avatar, // Use profileImage from backend
      lastMessage: c.lastMessage || "No messages",
      timestamp: c.lastMessageAt,
      unread: c.unreadCount || 0,
    };
  });

  if (loadingConvs)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-6rem)] sm:h-[600px] md:h-[calc(100vh-5rem)] border rounded-lg shadow-sm overflow-hidden bg-background mt-6">
      <ConversationList
        conversations={uiConversations}
        selectedId={selectedId}
        onSelect={handleSelectConversation}
        className={cn(
          "w-full md:w-[320px] lg:w-[360px] shrink-0",
          selectedId ? "hidden md:flex" : "flex",
        )}
      />

      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 bg-background",
          !selectedId ? "hidden md:flex" : "flex",
        )}
      >
        <ChatWindow
          conversation={
            activeConversation
              ? {
                  id: activeConversation.conversationId,
                  name: activeConversation.withUser?.fullName,
                  avatar: activeConversation.withUser?.avatar,
                }
              : null
          }
          messages={messages.map((m) => ({
            id: m._id,
            text: m.content,
            sender: m.senderId === user?._id ? "me" : "them",
            timestamp: m.createdAt,
          }))}
          currentUserId={user?._id}
          onSendMessage={handleSendMessage}
          onBack={() => handleSelectConversation(null)}
        />
      </div>
    </div>
  );
}
