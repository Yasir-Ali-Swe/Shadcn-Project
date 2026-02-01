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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner"; // Assuming sonner is used for toasts, seen file sonner.jsx
import { useState } from "react";

// import { dummyProposals } from "@/lib/dummy-data/proposals";

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

  const proposals = result?.data || [];

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

                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="text-center py-8 text-muted-foreground">
                      No proposal found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {proposals.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium max-w-[150px]">
                    <div className="truncate" title={p.clientId?.fullName}>
                      {p.clientId?.fullName || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={p.clientId?.email}>
                      {p.clientId?.email}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="truncate" title={p.title}>
                      {p.title}
                    </div>
                  </TableCell>

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
                    <div className="flex justify-end gap-2">
                      {/* Accept Action */}
                      {(p.status === "pending" || p.status === "accepted") && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-8 w-8 p-0 ${
                                  p.status === "accepted"
                                    ? "bg-green-100 text-green-700 border-green-500 opacity-100 cursor-not-allowed"
                                    : "border-green-500 text-green-600 hover:bg-green-50"
                                }`}
                                onClick={() =>
                                  p.status === "pending" &&
                                  handleAction(p._id, "accepted")
                                }
                                disabled={
                                  p.status !== "pending" ||
                                  updateStatusMutation.isPending
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {p.status === "accepted"
                                  ? "Proposal Accepted"
                                  : "Accept Proposal"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* Reject Action */}
                      {(p.status === "pending" || p.status === "rejected") && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-8 w-8 p-0 ${
                                  p.status === "rejected"
                                    ? "bg-red-100 text-red-700 border-red-500 opacity-100 cursor-not-allowed"
                                    : "border-red-500 text-red-600 hover:bg-red-50"
                                }`}
                                onClick={() =>
                                  p.status === "pending" &&
                                  handleAction(p._id, "rejected")
                                }
                                disabled={
                                  p.status !== "pending" ||
                                  updateStatusMutation.isPending
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {p.status === "rejected"
                                  ? "Proposal Rejected"
                                  : "Reject Proposal"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
