"use client";

import { useQuery } from "@tanstack/react-query";
import { clerkApi } from "@/lib/api/clerk";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CourtOfficersPage() {
  const { data: result, isLoading } = useQuery({
    queryKey: ["myOfficers"],
    queryFn: clerkApi.getMyCourtOfficers,
  });

  const officers = result?.data || [];

  if (isLoading) return <div className="p-8">Loading officers...</div>;

  return (
    <div className="space-y-6 pt-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Court Officers</h2>
        <p className="text-muted-foreground">
          Officers assigned to your court.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {officers.map((officer) => (
          <Card
            key={officer._id}
            className="hover:bg-muted/50 transition-colors"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserCog className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {officer.userId?.fullName}
                </CardTitle>
                <CardDescription>{officer.userId?.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-muted-foreground">Designation</span>
                <span>{officer.designation}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {officers.length === 0 && (
          <p className="col-span-3 text-center text-muted-foreground py-10">
            No court officers found.
          </p>
        )}
      </div>
    </div>
  );
}
