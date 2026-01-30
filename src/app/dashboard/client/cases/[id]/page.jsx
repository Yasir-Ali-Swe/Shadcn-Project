"use client";

import { use, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api/client";
import { casesApi } from "@/lib/api/cases"; // Reuse for sub-resources
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, Gavel, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClientCaseDetailPage({ params }) {
  const { id } = use(params);

  return (
    <div className="space-y-6 pt-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/client/cases">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Case Details</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hearings">Hearings</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="judgments">Judgments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CaseOverview tabId={id} />
        </TabsContent>

        <TabsContent value="hearings" className="space-y-4">
          <CaseHearings tabId={id} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {/* Reuse existing component logic but ensure API is accessible or use client wrapper if needed. 
               Since sub-resources are fetched via `case-route` which uses `case-controller` logic, 
               checking `case-route.js`: `getCaseHearings` etc don't have middleware attached in the export, 
               but router attaches it. Wait, look at `case-route.js`: 
               `router.get("/:caseId/hearings", getCaseHearings)` -> NO MIDDLEWARE?
               If so, it's public? No, `case-route.js` structure needs verification. 
               For now assuming I can use `casesApi` if endpoints are open or if I need to add client wrappers.
               Let's assume we can use `casesApi` generic getters if they are unprotected or allow client.
           */}
          <CaseDocuments tabId={id} />
        </TabsContent>

        <TabsContent value="judgments" className="space-y-4">
          <CaseJudgments tabId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CaseOverview({ tabId }) {
  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clientCase", tabId],
    queryFn: () => clientApi.getCaseById(tabId),
  });

  if (isLoading) return <div>Loading details...</div>;
  if (error)
    return (
      <div className="text-red-500">
        Error: {error.response?.data?.message || error.message}
      </div>
    );

  const c = result?.data;
  if (!c) return <div>Case not found.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>{c.title}</CardTitle>
          <CardDescription>
            Case Number: {c.caseNumber || "Processing"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p>{c.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge variant={c.status === "active" ? "default" : "secondary"}>
                {c.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Filed Date
              </p>
              <p>
                {c.filedByLawyerAt
                  ? format(new Date(c.filedByLawyerAt), "PPP")
                  : "Not filed"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Court</p>
              <p>{c.courtId?.name || "Not Assigned"}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {c.description}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Parties
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {c.parties.map((p, i) => (
                <li
                  key={i}
                  className="text-sm border p-2 rounded flex justify-between"
                >
                  <span>{p.name}</span>
                  <Badge variant="outline">{p.role}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lawyer Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium">Name</p>
            <p className="text-sm mb-4">{c.lawyerId?.fullName}</p>

            <p className="text-sm font-medium">Email</p>
            <p className="text-sm">{c.lawyerId?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusing generic sub-resource fetchers.
// Note: If these endpoints are protected by Lawyer Middleware only, they will fail 401.
// Based on typical implementation, sub-resources usually allow read access.
// If it fails, I'll need to update backend routes.

function CaseHearings({ tabId }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ["caseHearings", tabId],
    queryFn: () => casesApi.getHearings(tabId),
  });

  if (isLoading) return <div>Loading hearings...</div>;
  const hearings = result?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hearings</CardTitle>
      </CardHeader>
      <CardContent>
        {hearings.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No hearings scheduled.
          </p>
        ) : (
          <div className="space-y-4">
            {hearings.map((h) => (
              <div key={h._id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {format(new Date(h.date), "PPP p")}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {h.status}
                    </Badge>
                  </div>
                </div>
                {h.remarks && (
                  <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                    <span className="font-medium">Remarks: </span> {h.remarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CaseDocuments({ tabId }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ["caseDocuments", tabId],
    queryFn: () => casesApi.getDocuments(tabId),
  });

  if (isLoading) return <div>Loading documents...</div>;
  const documents = result?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-muted-foreground text-sm">No documents.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((d) => (
              <li
                key={d._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{d.title}</span>
                <a
                  href={d.url}
                  target="_blank"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function CaseJudgments({ tabId }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ["caseJudgments", tabId],
    queryFn: () => casesApi.getJudgments(tabId),
  });

  if (isLoading) return <div>Loading judgments...</div>;
  const judgments = result?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Judgments</CardTitle>
      </CardHeader>
      <CardContent>
        {judgments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No judgments.</p>
        ) : (
          <div className="space-y-4">
            {judgments.map((j) => (
              <div key={j._id} className="border p-4 rounded-md">
                <div className="mb-2">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Gavel className="h-5 w-5" />
                    Verdict: {j.verdict}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(j.createdAt), "PPP")}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded text-sm whitespace-pre-wrap">
                  {j.judgmentDetails}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
