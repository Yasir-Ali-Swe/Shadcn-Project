import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function CaseOverviewTab({ caseData, role }) {
  // role: "lawyer", "client", "court_officer"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Overview</CardTitle>
        <CardDescription>Details of the case.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
          <p className="text-lg font-medium break-words">{caseData.title}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
          <Badge variant="outline">{caseData.type}</Badge>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Description
          </h4>
          <p className="text-sm whitespace-pre-wrap break-words">
            {caseData.description}
          </p>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Parties involved
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {caseData.parties?.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <span className="font-medium break-words min-w-0">
                  {p.name}
                </span>
                <Badge
                  variant="secondary"
                  className="uppercase text-[10px] shrink-0 ml-2"
                >
                  {p.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Show Lawyer Details for Client and Court Officer */}
        {role !== "lawyer" && caseData.lawyerId && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Lawyer
              </h4>
              <div className="flex flex-col">
                <span className="font-medium break-words">
                  {caseData.lawyerId.fullName || "Not assigned"}
                </span>
                <span className="text-sm text-muted-foreground break-words">
                  {caseData.lawyerId.email}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
