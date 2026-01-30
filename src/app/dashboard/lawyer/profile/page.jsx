"use client";

import { useQuery } from "@tanstack/react-query";
import { lawyerApi } from "@/lib/api/lawyer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Mail, User } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  // We need an API to get the FULL profile (UserInfo + LawyerProfile details)
  // lawyerApi.getProfile() (mapped to /get-lawyer-profile) returns the LawyerProfile model
  // which populates 'lawyerProfileId' (UserInfo) and 'userId'.

  // However, if the user ONLY completed the "Basic" profile (complete-profile),
  // 'LawyerProfile' (professional info) might not exist yet!
  // The 'completeProfile' function only creates 'UserInfo'.
  // 'getLawyerProfile' in backend requires 'LawyerProfile' doc to exist, or it returns 404.

  // So if a user just finished 'complete-profile', this page will 404.
  // We need to fetch 'UserInfo' separately or handle the 404 gracefully.
  // Actually, there is 'getLawyerInfo' API (/get-info) which returns UserInfo.
  // Let's use THAT if we are only assuming basic profile completion.

  // BUT the sidebar usually implies "My Professional Profile".
  // Let's try to fetch both or fallback.

  // Actually, I'll use a new wrapper or just try to get 'getLawyerInfo' first as base.
  // Backend 'getLawyerInfo' fetches UserInfoModel.

  const {
    data: infoResult,
    isLoading: infoLoading,
    error: infoError,
  } = useQuery({
    queryKey: ["lawyerInfo"],
    queryFn: lawyerApi.getInfo,
  });

  const lawyerInfo = infoResult?.data;

  if (infoLoading) return <div>Loading profile...</div>;

  // If no info found (404), lawyerInfo might be undefined.
  // We can show basic auth user info still.

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <Button variant="outline" asChild>
          <Link href="/dashboard/lawyer/complete-profile">Edit Basic Info</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={
                    lawyerInfo?.profileImageUrl ||
                    "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">{user?.fullName}</p>
                <p className="text-muted-foreground">{user?.email}</p>
                <Badge className="mt-1 capitalize">{user?.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lawyerInfo ? (
              <>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    DOB:{" "}
                    {lawyerInfo.dob
                      ? format(new Date(lawyerInfo.dob), "PPP")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {lawyerInfo.city}, {lawyerInfo.province}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                Additional profile information not set.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
