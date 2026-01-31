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
    getSubmittedCases: async (status) => {
        const query = status ? `?status=${status}` : "";
        const response = await api.get(`/case/get-submited-cases${query}`);
        return response.data;
    },

    // Register Case
    registerCase: async (caseId, data) => {
        // data should contain { courtOfficerId }
        const response = await api.post(`/case/register-case/${caseId}`, data);
        return response.data;
    },

    // Case Details
    getCaseById: async (caseId) => {
        const response = await api.get(`/case/clerk/case/${caseId}`);
        return response.data;
    },
};
