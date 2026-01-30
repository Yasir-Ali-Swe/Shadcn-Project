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
import { Button } from "@/components/ui/button";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function ClientProposalsPage() {
  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["clientProposals"],
    queryFn: () => clientApi.getProposals(),
  });

  const [selectedProposal, setSelectedProposal] = useState(null);

  const proposals = result?.data || [];

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
          <h2 className="text-3xl font-bold tracking-tight">Proposals</h2>
          <p className="text-muted-foreground">
            Track proposals you have sent to lawyers.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-slate-50">
          <h3 className="text-lg font-medium text-slate-900">
            No proposals sent yet
          </h3>
          <p className="text-slate-500">
            Visit a lawyer's profile to send a proposal.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((p) => (
            <Card
              key={p._id}
              className="cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setSelectedProposal(p)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge
                    variant={
                      p.status === "accepted"
                        ? "default"
                        : p.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {p.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(p.createdAt), "MMM d")}
                  </span>
                </div>
                <CardTitle className="line-clamp-1">{p.title}</CardTitle>
                <CardDescription>
                  To: {p.lawyerId?.fullName || "Lawyer"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {p.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedProposal}
        onOpenChange={(open) => !open && setSelectedProposal(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProposal?.title}</DialogTitle>
            <DialogDescription>
              Sent to {selectedProposal?.lawyerId?.fullName} on{" "}
              {selectedProposal &&
                format(new Date(selectedProposal.createdAt), "PPP")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Status</h4>
              <Badge
                variant={
                  selectedProposal?.status === "accepted"
                    ? "default"
                    : selectedProposal?.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {selectedProposal?.status.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Description</h4>
              <p className="text-sm text-slate-500 whitespace-pre-wrap">
                {selectedProposal?.description}
              </p>
            </div>
            {selectedProposal?.lawyerId?.email && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium leading-none">
                  Lawyer/Firm Contact
                </h4>
                <p className="text-sm text-slate-500">
                  {selectedProposal.lawyerId.email}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
