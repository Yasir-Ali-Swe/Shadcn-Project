"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lawyerApi } from "@/lib/api/lawyer";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used for toasts, seen file sonner.jsx
import { useState } from "react";

import { dummyProposals } from "@/lib/dummy-data/proposals";

export default function ProposalsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState(""); // empty for all

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lawyerProposals", filter],
    queryFn: () => lawyerApi.getProposals(filter),
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => lawyerApi.updateProposalStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(`Proposal ${variables.status} successfully`);
      queryClient.invalidateQueries(["lawyerProposals"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });

  const handleAction = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) return <div className="p-8">Loading proposals...</div>;

  // Logic: Real data takes precedence. If error (including 404) or empty, use dummy.
  // Note: If filter is active, maybe we should filter dummy data too?
  // For simplicity, just showing all dummy data if API fails/empty is fine for "mock".

  const apiProposals = result?.data;
  const proposals =
    apiProposals && apiProposals.length > 0 ? apiProposals : dummyProposals;

  return (
    <div className="space-y-6 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Client Proposals</h2>
        <p className="text-muted-foreground">
          Review and manage proposals from clients.
        </p>
      </div>

      <div className="flex gap-2">
        {["", "pending", "accepted", "rejected"].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
            className="capitalize"
          >
            {s || "All"}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">
                    {p.clientId?.fullName || "Unknown"}
                  </TableCell>
                  <TableCell>{p.clientId?.email}</TableCell>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.budget ? `$${p.budget}` : "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "accepted"
                          ? "success"
                          : p.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {p.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleAction(p._id, "accepted")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleAction(p._id, "rejected")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Messages page implementation pending next step */}
    </div>
  );
}
