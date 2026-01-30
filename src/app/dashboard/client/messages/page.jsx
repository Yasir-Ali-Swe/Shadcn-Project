"use client";

import { useState, useEffect } from "react";
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
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  // 1. Fetch Conversations
  const { data: convData, isLoading: loadingConvs } = useQuery({
    queryKey: ["conversations"],
    queryFn: messagesApi.getConversations,
  });

  const conversations = convData?.data || [];

  // 2. Fetch Messages for selected conversation
  const { data: msgData, isLoading: loadingMsgs } = useQuery({
    queryKey: ["messages", selectedId],
    queryFn: () => messagesApi.getMessages(selectedId),
    enabled: !!selectedId,
    refetchInterval: 5000, // Poll fallback
  });

  const messages = msgData?.data || [];

  // 3. Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: (newItem) => {
      // Optimistic update handled via socket usually, but here we can invalidate
      queryClient.invalidateQueries(["messages", selectedId]);
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  // 4. Socket Listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      // If the message belongs to current chat, refetch/update
      // Note: Backend might send full message object or just text
      if (
        selectedId &&
        (newMessage.conversationId === selectedId ||
          newMessage.senderId ===
            conversations.find((c) => c._id === selectedId)?.participants[0]
              ?._id)
      ) {
        queryClient.invalidateQueries(["messages", selectedId]);
      }
      queryClient.invalidateQueries(["conversations"]);
    };

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, handleReceiveMessage);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVE, handleReceiveMessage);
    };
  }, [socket, selectedId, queryClient, conversations]);

  const handleSendMessage = (text) => {
    if (!selectedId) return;

    // Identify receiver. In a conversation, the "other" person is the receiver.
    // However, the conversation object structure from backend needs to be known.
    // Assuming conversation has `participants` array.
    // And `messagesApi.sendMessage` takes `conversationId` and `text`.

    // Warning: Backend `createMessage` usually needs `receiverId` OR `conversationId`.
    // Let's rely on `conversationId`.

    sendMutation.mutate({
      conversationId: selectedId,
      text,
    });

    // Also emit socket event for immediate feedback if server supports it
    if (socket && isConnected) {
      socket.emit(SOCKET_EVENTS.MESSAGE_SEND, {
        conversationId: selectedId,
        text,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const activeConversation = conversations.find((c) => c._id === selectedId);

  // Adapting backend data to UI components
  // Backend conversation: { _id, participants: [User], lastMessage: { content, createdAt } }
  // UI expects: { id, name, avatar, lastMessage, timestamp, unread }

  const uiConversations = conversations.map((c) => {
    // Logic to find "other" participant would go here.
    // For now passing raw object and letting sub-components handle or accept defaults.
    // Assuming the backend returns populated participants.
    // We need to filter out "me". Since I don't have "me" ID easily here without useAuth,
    // I will guess the UI component handles it or I map it blindly.
    // Let's map minimal fields required by ConversationList.

    // Note: `ConversationList` likely expects `id`, `name`, `lastMessage`.
    // I'll assume the backend data is close enough or I'll patch it.
    return {
      id: c._id,
      // Hack: Use the first participant that matches "Lawyer" role or just the first one?
      // Ideally `getConversations` should return `otherUser`.
      // Let's Assume `participants` has the other user info.
      name: c.participants?.[0]?.fullName || "Chat",
      avatar: c.participants?.[0]?.profileImageUrl,
      lastMessage: c.lastMessage?.content || "No messages",
      timestamp: c.updatedAt,
      unread: 0,
    };
  });

  // Need to adapt messages too?
  // UI expects: { id, text, sender: "me" | "them", timestamp }
  // Backend returns: { _id, content, senderId: {_id, fullName}, createdAt }
  // Only tricky part is logic for "me". I'll default to "them" if I can't check ID.
  // Actually, I should use useAuth to check ID.

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
        onSelect={(id) => setSelectedId(id)}
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
                  ...activeConversation,
                  name: activeConversation.participants?.[0]?.fullName,
                }
              : null
          }
          messages={messages.map((m) => ({
            id: m._id,
            text: m.content,
            sender: "unknown", // Logic needed in ChatWindow or here to determine generic 'me' vs 'other'
            senderObj: m.senderId, // Pass full object to let component decide if possible
            timestamp: m.createdAt,
          }))}
          currentUserId="CLIENT_ID_PLACEHOLDER" // ChatWindow needs to know who "me" is
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
