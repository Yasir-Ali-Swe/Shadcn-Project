"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clerkApi } from "@/lib/api/clerk";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gavel, Eye, CheckCircle2 } from "lucide-react";

export default function SubmittedCasesPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: result, isLoading } = useQuery({
    queryKey: ["submittedCases", statusFilter],
    queryFn: () =>
      clerkApi.getSubmittedCases(
        statusFilter === "all" ? undefined : statusFilter,
      ),
  });

  const cases = result?.data || [];

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Court Cases</h2>
          <p className="text-muted-foreground">
            Manage submitted and registered cases for your court.
          </p>
        </div>
        <div className="w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cases</SelectItem>
              <SelectItem value="submitted">Pending Registration</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors bg-muted/50">
                <th className="h-12 px-4 align-middle font-medium">Title</th>
                <th className="h-12 px-4 align-middle font-medium">Type</th>
                <th className="h-12 px-4 align-middle font-medium">
                  Submission Status
                </th>
                <th className="h-12 px-4 align-middle font-medium">
                  Case Status
                </th>
                <th className="h-12 px-4 align-middle font-medium">Lawyer</th>
                <th className="h-12 px-4 align-middle font-medium">Officer</th>
                <th className="h-12 px-4 align-middle font-medium">
                  Submitted Date
                </th>
                <th className="h-12 px-4 align-middle font-medium text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center">
                    Loading cases...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No cases found.
                  </td>
                </tr>
              ) : (
                cases.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td
                      className="p-4 align-middle font-medium truncate max-w-[200px]"
                      title={item.title}
                    >
                      {item.title}
                      <div className="text-xs text-muted-foreground font-normal truncate">
                        {item.caseNumber || "No Case No."}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline">{item.type}</Badge>
                    </td>
                    <td className="p-4 align-middle">
                      {item.submissionStatus === "registered" ? (
                        <Badge
                          variant="outline"
                          className="text-green-700 border-green-600 bg-green-50"
                        >
                          Registered
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-600 hover:bg-blue-700">
                          Submitted
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={
                          item.status === "active"
                            ? "default"
                            : item.status === "closed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle max-w-[150px]">
                      <div className="truncate" title={item.lawyerId?.fullName}>
                        {item.lawyerId?.fullName || "Unknown"}
                      </div>
                    </td>
                    <td className="p-4 align-middle max-w-[150px]">
                      <div
                        className="truncate"
                        title={item.courtOfficerId?.fullName}
                      >
                        {item.courtOfficerId?.fullName || "-"}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {item.filedByLawyerAt
                        ? format(new Date(item.filedByLawyerAt), "MMM dd, yyyy")
                        : "-"}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        asChild
                        size="sm"
                        variant={
                          item.submissionStatus === "registered"
                            ? "ghost"
                            : "default"
                        }
                      >
                        <Link href={`/dashboard/clerk/cases/${item._id}`}>
                          {item.submissionStatus === "registered" ? (
                            <>
                              <Eye className="w-4 h-4 mr-1" /> View
                            </>
                          ) : (
                            <>
                              <Gavel className="w-4 h-4 mr-1" /> Register
                            </>
                          )}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
