"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courtOfficerApi } from "@/lib/api/court-officer";
import { OfficerProfileForm } from "@/components/dashboard/court-officer/OfficerProfileForm";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function OfficerProfilePage() {
  const queryClient = useQueryClient();

  const { data: result, isLoading } = useQuery({
    queryKey: ["officerProfile"],
    queryFn: courtOfficerApi.getProfile,
  });

  const profile = result?.data?.info || {};
  const user = result?.data || {};
  const officerDetails = result?.data?.officerDetails || {};

  const mutation = useMutation({
    mutationFn: courtOfficerApi.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["officerProfile"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update");
    },
  });

  if (isLoading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto pt-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Officer Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal and professional details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
          <CardDescription>System assigned information.</CardDescription>
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
                Assigned Court
              </span>
              <p>{officerDetails.courtId?.name || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Role
              </span>
              <p className="capitalize">Court Officer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <OfficerProfileForm
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
