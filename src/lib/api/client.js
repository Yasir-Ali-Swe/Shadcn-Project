import api from "@/lib/axios";

export const clientApi = {
    getProfile: async () => {
        const response = await api.get("/client/get-profile");
        return response.data;
    },
    createProfile: async (data) => {
        const response = await api.post("/client/create-profile", data);
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put("/client/update-profile", data);
        return response.data;
    },
    sendProposal: async (data) => {
        const response = await api.post("/client/send-proposal", data);
        return response.data;
    },
    getProposals: async (status) => {
        const query = status ? `?status=${status}` : "";
        const response = await api.get(`/client/get-proposals-sent${query}`);
        return response.data;
    },
    getCases: async () => {
        const response = await api.get("/case/client/cases");
        return response.data;
    },
    getCaseById: async (caseId) => {
        const response = await api.get(`/case/client/cases/${caseId}`);
        return response.data;
    }
};
