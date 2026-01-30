"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus, Shield, Gavel } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function AdminCourtDetailPage({ params }) {
  const { courtId } = use(params);
  const queryClient = useQueryClient();
  const [selectedClerk, setSelectedClerk] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");

  // 1. Fetch Court Data
  const { data: courtData, isLoading: courtLoading } = useQuery({
    queryKey: ["court", courtId],
    queryFn: () => adminApi.getCourtById(courtId),
  });

  // 2. Fetch Unassigned Clerks (Only if needed)
  const { data: clerksData } = useQuery({
    queryKey: ["unassignedClerks"],
    queryFn: adminApi.getUnassignedClerks,
    enabled: !!courtData?.court && !courtData.court.clerkId, // Only fetch if no clerk assigned
  });

  // 3. Fetch Unassigned Officers
  const { data: officersData } = useQuery({
    queryKey: ["unassignedOfficers"],
    queryFn: adminApi.getUnassignedCourtOfficers,
  });

  // Mutations
  const assignClerkMutation = useMutation({
    mutationFn: adminApi.assignClerk,
    onSuccess: () => {
      toast.success("Clerk assigned successfully");
      queryClient.invalidateQueries(["court", courtId]);
      queryClient.invalidateQueries(["unassignedClerks"]);
      setSelectedClerk("");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Assignment failed"),
  });

  const assignOfficerMutation = useMutation({
    mutationFn: adminApi.assignCourtOfficer,
    onSuccess: () => {
      toast.success("Officer assigned successfully");
      queryClient.invalidateQueries(["court", courtId]);
      queryClient.invalidateQueries(["unassignedOfficers"]);
      setSelectedOfficer("");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Assignment failed"),
  });

  if (courtLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  const court = courtData?.court;
  const assignedOfficers = courtData?.assignedOfficers || [];
  const unassignedClerks = clerksData?.data || [];
  const unassignedOfficers = officersData?.data || [];

  if (!court) return <div className="p-8">Court not found</div>;

  return (
    <div className="space-y-6 pt-6 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{court.name}</h2>
        <div className="flex items-center gap-2 text-muted-foreground mt-1">
          <Badge variant="outline">{court.type}</Badge>
          <span>
            • {court.city}, {court.province}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* CLERK ASSIGNMENT */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Clerk Assignment
            </CardTitle>
            <CardDescription>
              Only one clerk can be assigned per court.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {court.clerkId ? (
              <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">{court.clerkId.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {court.clerkId.email}
                  </p>
                </div>
                <Badge variant="default">Assigned</Badge>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Select
                    value={selectedClerk}
                    onValueChange={setSelectedClerk}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a clerk..." />
                    </SelectTrigger>
                    <SelectContent>
                      {unassignedClerks.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No available clerks
                        </SelectItem>
                      ) : (
                        unassignedClerks.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.fullName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full"
                  disabled={!selectedClerk || assignClerkMutation.isPending}
                  onClick={() =>
                    assignClerkMutation.mutate({
                      clerkId: selectedClerk,
                      courtId: court._id,
                    })
                  }
                >
                  {assignClerkMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Assign Clerk
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* COURT OFFICERS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Court Officers
            </CardTitle>
            <CardDescription>
              Manage security and officers for this court.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Assign New */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Select
                  value={selectedOfficer}
                  onValueChange={setSelectedOfficer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add an officer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedOfficers.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No available officers
                      </SelectItem>
                    ) : (
                      unassignedOfficers.map((o) => (
                        <SelectItem key={o._id} value={o._id}>
                          {o.fullName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                variant="outline"
                disabled={!selectedOfficer || assignOfficerMutation.isPending}
                onClick={() =>
                  assignOfficerMutation.mutate({
                    userId: selectedOfficer,
                    courtId: court._id,
                  })
                }
              >
                {assignOfficerMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Officer
              </Button>
            </div>

            <Separator />

            {/* List Existing */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Assigned Officers ({assignedOfficers.length})
              </h4>
              {assignedOfficers.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No officers assigned yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {assignedOfficers.map((officer) => (
                    <div
                      key={officer._id}
                      className="flex justify-between items-center p-2 rounded hover:bg-muted/50 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>{officer.userId?.fullName || "Unknown"}</span>
                      </div>
                      {/* Future: Unassign Button */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
