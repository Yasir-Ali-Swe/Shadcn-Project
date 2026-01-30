"use client";

import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { dummyCases } from "@/lib/dummy-data/cases"; // Fallback
import { Loader2 } from "lucide-react";

export default function ClientCasesPage() {
  const { data: result, isLoading } = useQuery({
    queryKey: ["clientCases"],
    queryFn: () => clientApi.getCases(),
  });

  // Logic: Use real data if available, else if array is empty use mock data for preview
  let cases = result?.data || [];
  let isMock = false;

  if (!isLoading && cases.length === 0) {
    cases = dummyCases;
    isMock = true;
  }

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Cases</h2>
          <p className="text-muted-foreground">
            View the status and details of your legal cases.
          </p>
        </div>
        {isMock && (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Preview Mode (Mock Data)
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <Link key={c._id} href={`/dashboard/client/cases/${c._id}`}>
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge
                    variant={c.status === "active" ? "default" : "secondary"}
                  >
                    {c.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {c.createdAt
                      ? format(new Date(c.createdAt), "MMM d, yyyy")
                      : "N/A"}
                  </span>
                </div>
                <CardTitle className="line-clamp-1">{c.title}</CardTitle>
                <CardDescription>
                  {c.caseNumber || "Processing..."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{c.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Court:</span>
                    <span className="font-medium text-right truncate pl-4">
                      {c.courtId?.name || "Not Assigned"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lawyer:</span>
                    <span className="font-medium">
                      {c.lawyerId?.fullName || "Unknown"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
