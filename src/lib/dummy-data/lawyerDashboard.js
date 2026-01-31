export const dummyDashboardStats = {
    totalCases: 12,
    activeCases: 5,
    upcomingHearings: 2,
    pendingJudgments: 1,
    recentActivity: [
        {
            id: 1,
            type: "hearing",
            description: "Hearing scheduled for Case #CASE-2023-001",
            date: new Date().toISOString(),
        },
        {
            id: 2,
            type: "document",
            description: "New document uploaded for Case #CASE-2023-005",
            date: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 3,
            type: "proposal",
            description: "New proposal received from Client John Doe",
            date: new Date(Date.now() - 172800000).toISOString(),
        },
    ],
};
