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
import { Eye } from "lucide-react";

export default function ClientCasesPage() {
  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clientCases"],
    queryFn: casesApi.getClientCases,
    retry: false,
  });

  if (isLoading) {
    return <div className="p-8">Loading your cases...</div>;
  }

  const cases = result?.data || [];

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Cases</h2>
          <p className="text-muted-foreground">
            View the status and details of your legal cases.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case List</CardTitle>
          <CardDescription>
            All cases associated with your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You have no cases yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Lead Lawyer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submission Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium max-w-[120px]">
                      <div className="truncate" title={c.caseNumber}>
                        {c.caseNumber || (
                          <span className="text-muted-foreground italic">
                            Draft (Unfiled)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate" title={c.title}>
                        {c.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col max-w-[150px]">
                        <span
                          className="font-medium truncate"
                          title={c.lawyerId?.fullName}
                        >
                          {c.lawyerId?.fullName || "Unassigned"}
                        </span>
                        <span
                          className="text-xs text-muted-foreground truncate"
                          title={c.lawyerId?.email}
                        >
                          {c.lawyerId?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{c.type}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {/* Submission Status */}
                        {c.submissionStatus === "draft" && (
                          <Badge variant="secondary" className="w-fit">
                            Draft
                          </Badge>
                        )}
                        {c.submissionStatus === "submitted" && (
                          <Badge className="bg-blue-600 w-fit">Submitted</Badge>
                        )}
                        {c.submissionStatus === "registered" && (
                          <Badge
                            variant="outline"
                            className="text-green-700 border-green-600 bg-green-50 w-fit"
                          >
                            Registered
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/client/cases/${c._id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View
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
