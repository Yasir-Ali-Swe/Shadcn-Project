"use client";

import { useQuery } from "@tanstack/react-query";
import { casesApi } from "@/lib/api/cases";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

// import { dummyCases } from "@/lib/dummy-data/cases";

export default function CasesPage() {
  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lawyerCases"],
    queryFn: casesApi.getAll,
    retry: false,
  });

  if (isLoading) {
    return <div className="p-8">Loading cases...</div>;
  }

  const cases = result?.data || [];

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cases</h2>
          <p className="text-muted-foreground">
            Manage your assigned cases here.
          </p>
        </div>
        {/* Lawyer can't register cases directly? Usually they draft them. 
            The requirements mentioned "Lawyer Draft Case" exists in routes.
            Maybe add a "Draft New Case" button? 
            Prompt didn't explicitly ask for "Draft Case" UI, but it makes sense.
            I will leave it out for this specific step unless simple. 
            "Lawyer Draft Case" -> POST /draft-case.
            I'll add a provisional button.
        */}
        {/* Lawyer Draft Case Button */}
        <Button asChild>
          <Link href="/dashboard/lawyer/cases/new">
            <Plus className="mr-2 h-4 w-4" /> Draft New Case
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Cases</CardTitle>
          <CardDescription>
            List of all cases where you are the lead counsel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cases found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submission Status</TableHead>
                  <TableHead>Case Status</TableHead>
                  <TableHead>Date Filed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">
                      {c.caseNumber || (
                        <span className="text-muted-foreground italic">
                          Draft
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {c.clientId?.fullName || "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {c.clientId?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{c.type}</TableCell>
                    <TableCell>
                      {c.submissionStatus === "draft" && (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                      {c.submissionStatus === "submitted" && (
                        <Badge className="bg-blue-600 hover:bg-blue-700">
                          Submitted
                        </Badge>
                      )}
                      {c.submissionStatus === "registered" && (
                        <Badge
                          variant="outline"
                          className="text-green-700 border-green-600 bg-green-50"
                        >
                          Registered
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.status === "active"
                            ? "default"
                            : c.status === "closed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.filedByLawyerAt
                        ? format(new Date(c.filedByLawyerAt), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/lawyer/cases/${c._id}`}>
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
