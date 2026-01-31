"use client";
import { ClientProfileForm } from "@/components/dashboard/client/ClientProfileForm";
import { useMutation } from "@tanstack/react-query";
import { clientApi } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CompleteClientProfilePage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: clientApi.createProfile,
    onSuccess: async () => {
      toast.success("Profile completed successfully!");
      // Important: Refresh auth state so the Guard unlocks the dashboard
      // If refetchUser isn't available, window.location.reload() ensures fresh state.
      window.location.href = "/dashboard/client";
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save profile");
    },
  });

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <p className="text-muted-foreground">
          Please provide your details to continue to the dashboard.
        </p>
      </div>
      <ClientProfileForm
        onSubmit={(values) => mutation.mutate(values)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
