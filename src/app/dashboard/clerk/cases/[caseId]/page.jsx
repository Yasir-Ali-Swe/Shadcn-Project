"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clerkApi } from "@/lib/api/clerk";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ClerkCaseDetailPage() {
  const { caseId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState("");

  // Fetch Case
  const { data: caseResult, isLoading: caseLoading } = useQuery({
    queryKey: ["clerkCase", caseId],
    queryFn: () => clerkApi.getCaseById(caseId),
  });

  // Fetch Officers
  const { data: officersResult } = useQuery({
    queryKey: ["myOfficers"],
    queryFn: clerkApi.getMyCourtOfficers,
  });

  const caseData = caseResult?.data;
  const officers = officersResult?.data || [];

  // Register Mutation
  const mutation = useMutation({
    mutationFn: (data) => clerkApi.registerCase(caseId, data),
    onSuccess: () => {
      toast.success("Case registered successfully!");
      setIsRegisterOpen(false);
      queryClient.invalidateQueries(["clerkStats"]);
      router.push("/dashboard/clerk/cases"); // Back to list
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to register case");
    },
  });

  const handleRegister = () => {
    if (!selectedOfficer) {
      toast.error("Please select a court officer.");
      return;
    }
    mutation.mutate({ courtOfficerId: selectedOfficer });
  };

  if (caseLoading) return <div className="p-8">Loading...</div>;
  if (!caseData) return <div className="p-8">Case not found.</div>;

  return (
    <div className="space-y-6 pt-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/dashboard/clerk/cases">
            {" "}
            <ArrowLeft className="mr-2 h-4 w-4" /> Back{" "}
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {caseData.title}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{caseData.type}</Badge>
            <Badge>{caseData.submissionStatus}</Badge>
          </div>
        </div>
        <Button onClick={() => setIsRegisterOpen(true)} className="gap-2">
          <CheckCircle className="h-4 w-4" /> Register Case
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Description
              </span>
              <p className="text-sm mt-1">{caseData.description}</p>
            </div>
            <Separator />
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Filing Lawyer
              </span>
              <div className="text-sm font-medium mt-1">
                {caseData.lawyerId?.fullName}
              </div>
              <div className="text-xs text-muted-foreground">
                {caseData.lawyerId?.email}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Filing Date
              </span>
              <p className="text-sm">
                {caseData.filedByLawyerAt
                  ? format(new Date(caseData.filedByLawyerAt), "PPP")
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parties Involved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caseData.parties?.map((p, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0"
                >
                  <span className="font-medium">{p.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {p.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* REGISTER MODAL */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Case</DialogTitle>
            <DialogDescription>
              Assign a Court Officer to manage this case. This action will
              generate a Case Number and active status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Court Officer</Label>
              <Select
                onValueChange={setSelectedOfficer}
                value={selectedOfficer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an officer..." />
                </SelectTrigger>
                <SelectContent>
                  {officers.map((off) => (
                    <SelectItem key={off.userId?._id} value={off.userId?._id}>
                      {off.userId?.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {officers.length === 0 && (
                <p className="text-xs text-red-500">
                  No officers found in your court.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegister} disabled={mutation.isPending}>
              {mutation.isPending ? "Registering..." : "Confirm Registration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
