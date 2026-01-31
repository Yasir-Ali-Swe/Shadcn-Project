export const dummyProposals = [
    {
        _id: "prop1",
        client: {
            fullName: "Emily Blunt",
            email: "emily@example.com",
            profileImageUrl: "https://ui.shadcn.com/avatars/05.png"
        },
        title: "Divorce Consultation",
        description: "Seeking legal advice regarding a complex divorce settlement involving shared assets.",
        status: "Pending",
        createdAt: new Date().toISOString(),
    },
    {
        _id: "prop2",
        client: {
            fullName: "Robert Downey Jr.",
            email: "rdj@example.com",
            profileImageUrl: "https://ui.shadcn.com/avatars/01.png"
        },
        title: "Corporate Contract Review",
        description: "Need a review of a new partnership agreement for my tech startup.",
        status: "Accepted",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
        _id: "prop3",
        client: {
            fullName: "Chris Evans",
            email: "cap@example.com",
        },
        title: "Property Dispute",
        description: "Neighbor is encroaching on my land. Need legal representation.",
        status: "Rejected",
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
];
