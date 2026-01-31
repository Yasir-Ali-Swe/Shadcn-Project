import api from "../axios";

export const clerkApi = {
    // Stats
    getDashboardStats: async () => {
        const response = await api.get("/clerk/stats");
        return response.data;
    },

    // Profile
    getProfile: async () => {
        const response = await api.get("/clerk/profile");
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put("/clerk/profile", data);
        return response.data;
    },

    // Court Officers
    getMyCourtOfficers: async () => {
        const response = await api.get("/clerk/court-officers");
        return response.data;
    },

    // Cases (From Case Routes)
    getSubmittedCases: async () => {
        const response = await api.get("/case/get-submited-cases");
        return response.data;
    },

    // Register Case
    registerCase: async (caseId, data) => {
        // data should contain { courtOfficerId }
        const response = await api.post(`/case/register-case/${caseId}`, data);
        return response.data;
    },

    // Case Details (Lawyer/Client routes protect this usually, 
    // but Clerk needs to view details to register. 
    // Is there a generic 'getCase' for Clerk? 
    // 'clientGetCaseById' enforces 'isParty'.
    // 'lawyerGetTheCaseById' enforces 'lawyerId'.
    // Clerk needs their own 'getCase' or we rely on listed data.
    // Wait, I should add 'clerkGetCaseById' if needed. 
    // For now, I will trust the list view provides enough, 
    // or I might need to add 'clerkGetCaseById' to backend if Detail page is required.
    // UPDATE: User asked for "Case Detail Page".
    // I need to check if Clerk can fetch a single case.
    // 'clerkRegisterCase' exists but no 'clerkGetCase'.
    // I will rely on 'clerkGetSubmitedCases' which returns full case objects?
    // Or I will add 'clerkGetCaseById' to backend if I get stuck. 
    // Let's assume for now I might need it.

    // Actually, I can use the list data or just add a simple `get-case/:caseId` for clerk in case-controller.
    // I'll add `getCaseById` to the backend now to be safe.
};
