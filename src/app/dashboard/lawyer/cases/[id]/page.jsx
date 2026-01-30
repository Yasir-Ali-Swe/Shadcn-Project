"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { casesApi } from "@/lib/api/cases";
import { useParams } from "next/navigation";
import { CaseForm } from "@/components/dashboard/lawyer/cases/CaseForm";
import { SubmitCaseDialog } from "@/components/dashboard/lawyer/cases/SubmitCaseDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

export default function CaseDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["case", id],
    queryFn: () => casesApi.getById(id),
  });

  const updateMutation = useMutation({
    mutationFn: (values) => casesApi.updateDraft(id, values),
    onSuccess: () => {
      toast.success("Draft updated successfully");
      queryClient.invalidateQueries(["case", id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update draft");
    },
  });

  if (isLoading) return <div className="p-8">Loading case details...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {error.message}</div>;

  const caseData = result?.data;
  const isDraft = caseData?.submissionStatus === "draft";

  return (
    <div className="space-y-6 pt-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/lawyer/cases">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {caseData.caseNumber ? caseData.caseNumber : "Draft Case"}
              </h2>
              <Badge variant={isDraft ? "secondary" : "default"}>
                {caseData.submissionStatus.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              ID: {caseData._id}
            </p>
          </div>
        </div>

        {isDraft && (
          <Button onClick={() => setSubmitDialogOpen(true)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Submit Case
          </Button>
        )}
      </div>

      {isDraft ? (
        /* EDIT MODE (Draft) */
        <div className="relative">
          <div className="absolute top-0 right-0 -mt-12 mr-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Editable
            </span>
          </div>
          <CaseForm
            defaultValues={{
              title: caseData.title,
              type: caseData.type,
              description: caseData.description,
              parties: caseData.parties.map((p) => ({
                role: p.role,
                name: p.name,
              })),
            }}
            onSubmit={(values) => updateMutation.mutate(values)}
            isSubmitting={updateMutation.isPending}
            mode="update"
          />
        </div>
      ) : (
        /* READ ONLY MODE (Submitted/Registered) */
        <div className="space-y-6">
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-950/20 p-4 border border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <p className="text-sm font-medium">
              This case has been submitted and is locked for editing.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{caseData.title}</CardTitle>
              <CardDescription>{caseData.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h4>
                <p className="text-sm whitespace-pre-wrap">
                  {caseData.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Parties
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {caseData.parties.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border p-2 rounded text-sm"
                    >
                      <span className="font-semibold">{p.name}</span>
                      <Badge variant="outline">{p.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {caseData.courtId && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Assigned Court ID
                  </h4>
                  <p className="text-sm font-mono">{caseData.courtId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <SubmitCaseDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        caseId={id}
        onSubmitted={() => {
          // Refetch to switch to Read Only mode
          queryClient.invalidateQueries(["case", id]);
        }}
      />
    </div>
  );
}
