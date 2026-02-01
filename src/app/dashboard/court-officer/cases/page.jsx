"use client";

import { useQuery } from "@tanstack/react-query";
import { courtOfficerApi } from "@/lib/api/court-officer";
import { format } from "date-fns";
import { Eye, Loader2, Search } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function CourtOfficerCasesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courtOfficerCases"],
    queryFn: courtOfficerApi.getAllCases,
  });

  const cases = response?.data || [];

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load cases. Please try again.
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assigned Cases</h1>
          <p className="text-muted-foreground">
            Manage and track cases assigned to you.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case List</CardTitle>
          <CardDescription>
            Total assigned cases: {cases.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User / Client</TableHead>
                <TableHead>Lawyer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No cases found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((caseItem) => (
                  <TableRow key={caseItem._id}>
                    <TableCell className="font-medium">
                      <div className="truncate" title={caseItem.caseNumber}>
                        {caseItem.caseNumber || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate" title={caseItem.title}>
                        {caseItem.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{caseItem.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col max-w-[150px]">
                        <span
                          className="text-sm font-medium truncate"
                          title={caseItem.clientId?.fullName}
                        >
                          {caseItem.clientId?.fullName || "Unknown"}
                        </span>
                        <span
                          className="text-xs text-muted-foreground truncate"
                          title={caseItem.clientId?.email}
                        >
                          {caseItem.clientId?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <div
                        className="truncate"
                        title={caseItem.lawyerId?.fullName}
                      >
                        {caseItem.lawyerId?.fullName || "Unassigned"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          caseItem.status === "active"
                            ? "default"
                            : caseItem.status === "decided"
                              ? "success"
                              : "secondary"
                        }
                      >
                        {caseItem.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/court-officer/cases/${caseItem._id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
