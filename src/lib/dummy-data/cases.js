export const dummyCases = [
    {
        _id: "dummy1",
        caseNumber: "CASE-2024-001",
        title: "Contract Dispute - Smith vs. Jones",
        clientName: "John Smith",
        status: "Active",
        court: "High Court",
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "dummy2",
        caseNumber: "CASE-2024-002",
        title: "Property Settlement",
        clientName: "Sarah Connor",
        status: "Submitted",
        court: "District Court",
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        _id: "dummy3",
        caseNumber: "CASE-2024-003",
        title: "Traffic Violation Defense",
        clientName: "Michael Bay",
        status: "Draft",
        court: "Magistrate Court",
        updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
];
