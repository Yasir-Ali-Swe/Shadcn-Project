import api from "@/lib/axios";

export const lawyerApi = {
    getStats: async () => {
        const response = await api.get("/lawyer/dashboard-stats");
        return response.data;
    },
    getInfo: async () => {
        const response = await api.get("/lawyer/get-info");
        return response.data;
    },
    completeProfile: async (data) => {
        const response = await api.post("/lawyer/complete-profile", data);
        return response.data;
    },
    getProposals: async (status) => {
        const params = status ? { status } : {};
        const response = await api.get("/lawyer/get-proposals-received", { params });
        return response.data;
    },
    updateProposalStatus: async (proposalId, status) => {
        const response = await api.put("/lawyer/update-proposal-status", { proposalId, status });
        return response.data;
    }
};
