"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { courtOfficerApi } from "@/lib/api/court-officer";
import { OfficerProfileForm } from "@/components/dashboard/court-officer/OfficerProfileForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CompleteOfficerProfilePage() {
  const router = useRouter();

  // Fetch existing data (if any) to pre-fill
  // Ideally user shouldn't be here if profile is complete, but for safety:
  const { data: result } = useQuery({
    queryKey: ["officerProfile"],
    queryFn: courtOfficerApi.getProfile,
  });
  const profile = result?.data?.info || {};

  const mutation = useMutation({
    mutationFn: courtOfficerApi.updateProfile,
    onSuccess: () => {
      toast.success("Profile completed! Welcome.");
      // Force refresh to update AuthGuard/Redux state
      window.location.href = "/dashboard/court-officer";
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to complete profile");
    },
  });

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <p className="text-muted-foreground">
          Please provide your details to access the dashboard.
        </p>
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <OfficerProfileForm
          defaultValues={profile}
          onSubmit={(values) => mutation.mutate(values)}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
