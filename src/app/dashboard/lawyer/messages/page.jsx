"use client";

import MessagesLayout from "@/components/messages/MessagesLayout";

export default function MessagesPage() {
  return (
    <div className="h-full pt-4">
      <h2 className="text-3xl font-bold tracking-tight mb-4 px-1">Messages</h2>
      <MessagesLayout />
    </div>
  );
}
