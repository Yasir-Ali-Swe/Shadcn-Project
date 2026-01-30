"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clerkApi } from "@/lib/api/clerk";
import { ClerkProfileForm } from "@/components/dashboard/clerk/ClerkProfileForm";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ClerkProfilePage() {
  const queryClient = useQueryClient();

  const { data: result, isLoading } = useQuery({
    queryKey: ["clerkProfile"],
    queryFn: clerkApi.getProfile,
  });

  const profile = result?.data?.info || {};
  const user = result?.data || {};

  const mutation = useMutation({
    mutationFn: clerkApi.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["clerkProfile"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update");
    },
  });

  if (isLoading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto pt-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Read-only system information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Full Name
              </span>
              <p>{user.fullName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Email
              </span>
              <p>{user.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Role
              </span>
              <p className="capitalize">{user.role}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Assigned Court
              </span>
              <p>{user.clerkDetails?.courtId?.name || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ClerkProfileForm
            defaultValues={profile}
            onSubmit={(values) => mutation.mutate(values)}
            isSubmitting={mutation.isPending}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
