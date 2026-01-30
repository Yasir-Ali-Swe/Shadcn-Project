"use client";

import { ClientProfileForm } from "@/components/dashboard/client/ClientProfileForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ClientEditProfilePage() {
  const queryClient = useQueryClient();

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clientProfile"],
    queryFn: clientApi.getProfile,
    retry: false, // Don't retry on 404
  });

  const isProfileNotFound = error?.response?.status === 404;
  const isEditing = !isProfileNotFound && !!result;

  const mutation = useMutation({
    mutationFn: (values) => {
      // If we are editing, update. If not found (404), create.
      if (isEditing) {
        return clientApi.updateProfile(values);
      } else {
        return clientApi.createProfile(values);
      }
    },
    onSuccess: () => {
      toast.success(
        isEditing
          ? "Profile updated successfully!"
          : "Profile created successfully!",
      );
      queryClient.invalidateQueries(["clientProfile"]);

      // If we just created it, we might need to refresh auth state if it was previously incomplete
      // But typically Edit Profile is accessed when already complete.
      // Safest is to just invalidate and let the user continue.
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

  const profile = result?.clientProfile;

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Profile" : "Create Profile"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? "Update your personal information."
            : "Please create your profile to continue."}
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <ClientProfileForm
          defaultValues={
            isEditing
              ? {
                  dob: profile?.dob
                    ? new Date(profile.dob).toISOString().split("T")[0]
                    : "",
                  city: profile?.city || "",
                  province: profile?.province || "",
                  country: profile?.country || "",
                  profileImageUrl: profile?.profileImageUrl || "",
                }
              : undefined
          } // undefined defaults to empty in form component
          onSubmit={(values) => mutation.mutate(values)}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
