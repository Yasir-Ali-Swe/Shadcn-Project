"use client";

import { AdminProfileForm } from "@/components/dashboard/admin/AdminProfileForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminProfilePage() {
  const queryClient = useQueryClient();

  // Fetch Logic: Don't retry on 404 to allow Create Mode
  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: adminApi.getProfile,
    retry: false,
  });

  const isProfileNotFound = error?.response?.status === 404;
  const isEditing = !isProfileNotFound && !!result;

  const mutation = useMutation({
    mutationFn: (values) => {
      if (isEditing) {
        return adminApi.updateProfile(values);
      } else {
        return adminApi.createProfile(values);
      }
    },
    onSuccess: () => {
      toast.success(
        isEditing
          ? "Profile updated successfully!"
          : "Profile created successfully!",
      );
      queryClient.invalidateQueries(["adminProfile"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save profile");
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  const profile = result?.profile; // Admin API returns { success, message, profile }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Admin Profile" : "Create Admin Profile"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? "Manage your administrator details."
            : "Set up your admin profile to continue."}
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <AdminProfileForm
          defaultValues={
            isEditing
              ? {
                  dob: profile?.dob
                    ? new Date(profile.dob).toISOString().split("T")[0]
                    : "",
                  city: profile?.city || "",
                  province: profile?.province || "",
                  profileImageUrl: profile?.profileImageUrl || "",
                }
              : undefined
          }
          onSubmit={(values) => mutation.mutate(values)}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
