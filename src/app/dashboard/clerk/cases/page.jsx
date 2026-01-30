"use client";

import { useQuery } from "@tanstack/react-query";
import { clerkApi } from "@/lib/api/clerk";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gavel, Eye } from "lucide-react";

export default function SubmittedCasesPage() {
  const { data: result, isLoading } = useQuery({
    queryKey: ["submittedCases"],
    queryFn: clerkApi.getSubmittedCases,
  });

  const cases = result?.data || [];

  return (
    <div className="space-y-6 pt-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Submitted Cases</h2>
        <p className="text-muted-foreground">
          Cases submitted by lawyers waiting for registration.
        </p>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors bg-muted/50">
                <th className="h-12 px-4 align-middle font-medium">Title</th>
                <th className="h-12 px-4 align-middle font-medium">Type</th>
                <th className="h-12 px-4 align-middle font-medium">Lawyer</th>
                <th className="h-12 px-4 align-middle font-medium">Parties</th>
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
                  <td colSpan={6} className="p-4 text-center">
                    Loading cases...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No submitted cases found.
                  </td>
                </tr>
              ) : (
                cases.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle font-medium truncate max-w-[200px]">
                      {item.title}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline">{item.type}</Badge>
                    </td>
                    <td className="p-4 align-middle">
                      {item.lawyerId?.fullName || "Unknown"}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {item.parties?.map((p) => p.name).join(", ")}
                    </td>
                    <td className="p-4 align-middle">
                      {item.filedByLawyerAt
                        ? format(new Date(item.filedByLawyerAt), "MMM dd, yyyy")
                        : "-"}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/dashboard/clerk/cases/${item._id}`}>
                          <Eye className="w-4 h-4 mr-1" /> Review
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
