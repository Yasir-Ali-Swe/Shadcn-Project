"use client";

import { useQuery } from "@tanstack/react-query";
import { casesApi } from "@/lib/api/cases";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, FileText, Gavel, FileCheck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ClientCaseDetailsPage() {
  const { id } = useParams();

  // --- Queries ---
  const { data: caseResult, isLoading: caseLoading } = useQuery({
    queryKey: ["clientCase", id],
    queryFn: () => casesApi.getClientById(id),
  });

  const { data: hearingsResult, isLoading: hearingsLoading } = useQuery({
    queryKey: ["caseHearings", id],
    queryFn: () => casesApi.getClientHearings(id),
    enabled: !!caseResult?.data,
  });

  const { data: judgmentResult, isLoading: judgmentLoading } = useQuery({
    queryKey: ["caseJudgment", id],
    queryFn: () => casesApi.getClientJudgments(id),
    enabled: !!caseResult?.data,
  });

  if (caseLoading) return <div className="p-8">Loading case details...</div>;

  const caseData = caseResult?.data;
  if (!caseData) return <div className="p-8">Case not found</div>;

  const hearings = hearingsResult?.data || [];
  const judgment = judgmentResult?.data;
  const activeJudgment = Array.isArray(judgment) ? judgment[0] : judgment;

  // Status Badge Helper
  const getSubStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "submitted":
        return <Badge className="bg-blue-600">Submitted</Badge>;
      case "registered":
        return (
          <Badge
            variant="outline"
            className="text-green-700 border-green-600 bg-green-50"
          >
            Registered
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pt-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/client/cases">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {caseData.caseNumber || "New Case"}
              </h2>
              {getSubStatusBadge(caseData.submissionStatus)}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              ID: {caseData._id}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="hearings">Hearings</TabsTrigger>
          <TabsTrigger value="judgment">Judgment</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Overview</CardTitle>
              <CardDescription>Details of the case.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Title
                </h4>
                <p className="text-lg font-medium">{caseData.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Type
                </h4>
                <Badge variant="outline">{caseData.type}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h4>
                <p className="text-sm whitespace-pre-wrap">
                  {caseData.description}
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  Parties involved
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {caseData.parties.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <span className="font-medium">{p.name}</span>
                      <Badge
                        variant="secondary"
                        className="uppercase text-[10px]"
                      >
                        {p.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Your Lawyer
                </h4>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {caseData.lawyerId?.fullName || "Not assigned"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {caseData.lawyerId?.email}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: STATUS */}
        <TabsContent value="status" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Status Tracker</CardTitle>
              <CardDescription>
                Current status and tracking information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground leading-none">
                    Submission Status
                  </h4>
                  <div className="pt-1">
                    {getSubStatusBadge(caseData.submissionStatus)}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground leading-none">
                    Case Status
                  </h4>
                  <div className="pt-1">
                    <Badge
                      variant={
                        caseData.status === "active" ? "default" : "outline"
                      }
                    >
                      {caseData.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground leading-none">
                    Assigned Court
                  </h4>
                  <p className="font-medium pt-1">
                    {caseData.courtId?.name || "Not Assigned"}
                  </p>
                  {caseData.courtId?.city && (
                    <p className="text-xs text-muted-foreground">
                      {caseData.courtId.city}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground leading-none">
                    Court Officer
                  </h4>
                  <p className="font-medium pt-1">
                    {caseData.courtOfficerId?.fullName || "Pending Assignment"}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground leading-none">
                    Date Filed
                  </h4>
                  <p className="text-sm pt-1">
                    {caseData.filedByLawyerAt
                      ? format(new Date(caseData.filedByLawyerAt), "PPP")
                      : "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground leading-none">
                    Date Registered
                  </h4>
                  <p className="text-sm pt-1">
                    {caseData.registeredByClerkAt
                      ? format(new Date(caseData.registeredByClerkAt), "PPP")
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: HEARINGS */}
        <TabsContent value="hearings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hearings</CardTitle>
              <CardDescription>
                Schedule and history of hearings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hearingsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading hearings...
                </p>
              ) : hearings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Calendar className="h-8 w-8 mb-2 opacity-50" />
                  <p>No hearings scheduled yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hearings.map((hearing) => (
                    <div
                      key={hearing._id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base">
                            {format(new Date(hearing.date), "PPP")}
                          </span>
                          <Badge
                            variant={
                              hearing.status === "completed"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {hearing.status}
                          </Badge>
                        </div>
                        {hearing.time && (
                          <p className="text-sm text-muted-foreground">
                            Time: {hearing.time}
                          </p>
                        )}
                        {hearing.notes && (
                          <p className="text-sm mt-2">{hearing.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: JUDGMENT */}
        <TabsContent value="judgment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Judgment</CardTitle>
              <CardDescription>
                Final decision and judgment details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {judgmentLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading judgment...
                </p>
              ) : !activeJudgment ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Gavel className="h-10 w-10 mb-3 opacity-50" />
                  <h3 className="text-lg font-medium">Judgment Pending</h3>
                  <p className="text-sm max-w-sm mt-1">
                    The court has not yet issued a judgment for this case.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Judgment Issues</h3>
                      <p className="text-sm text-muted-foreground">
                        Date:{" "}
                        {format(new Date(activeJudgment.createdAt), "PPP")}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Summary / Decision</h4>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {activeJudgment.summary ||
                        activeJudgment.description ||
                        "No summary provided."}
                    </p>
                  </div>

                  {activeJudgment.attachment && (
                    <div className="pt-4">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Attached Judgment Document
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
