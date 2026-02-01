"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Check,
  CheckCircle2,
  Bell,
  Gavel,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

import { notificationsApi } from "@/lib/api/notifications";

export default function NotificationsPage({ role }) {
  // role prop for potential role-specific tweaks
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
  });

  const notifications = response?.data || [];

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unreadCount"]);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unreadCount"]);
    },
  });

  // Mark specific notification as read and navigate
  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      markReadMutation.mutate(n._id);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (isError)
    return <div className="p-8 text-red-500">Failed to load notifications</div>;

  // Helpers for Icons & Colors
  const getIcon = (type) => {
    switch (type) {
      case "hearing":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "judgment":
        return <Gavel className="h-5 w-5 text-purple-600" />;
      case "status":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "submission":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Updates on your cases and hearings.
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`relative group block`}
            >
              <Link
                href={
                  n.role === "lawyer"
                    ? `/dashboard/lawyer/cases/${n.caseId?._id || n.caseId}`
                    : `/dashboard/client/cases/${n.caseId?._id || n.caseId}`
                }
              >
                <Card
                  className={`transition-all hover:shadow-md cursor-pointer ${!n.isRead ? "bg-primary/5 border-primary/20" : "opacity-80"}`}
                >
                  <div className="absolute right-4 top-4 text-xs text-muted-foreground">
                    {format(new Date(n.createdAt), "PP p")}
                  </div>
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div
                      className={`p-2 rounded-full bg-background border ${!n.isRead ? "shadow-sm" : ""}`}
                    >
                      {getIcon(n.type)}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {n.title}
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        Case:{" "}
                        <span className="font-medium text-foreground">
                          {n.caseId?.caseNumber || "Unknown"}
                        </span>{" "}
                        — {n.caseId?.title}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80">{n.message}</p>

                    {/* Metadata Display (Hearing/Status specific) */}
                    {n.metadata && (
                      <div className="mt-3 text-xs bg-background/50 p-2 rounded border inline-block">
                        {n.metadata.hearingDate && (
                          <div className="flex gap-2">
                            <span className="font-semibold">Hearing Date:</span>{" "}
                            {format(new Date(n.metadata.hearingDate), "PPP")}
                          </div>
                        )}
                        {n.metadata.updatedReason && (
                          <div className="flex gap-2 mt-1">
                            <span className="font-semibold">Reason:</span>{" "}
                            {n.metadata.updatedReason}
                          </div>
                        )}
                        {n.metadata.status && (
                          <Badge variant="outline" className="mt-1">
                            {n.metadata.status.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
