import api from "@/lib/axios";

export const messagesApi = {
    getConversations: async () => {
        const response = await api.get("/messages/get-conversations");
        return response.data;
    },
    getMessages: async (conversationId) => {
        const response = await api.get(`/messages/get-messages-history/${conversationId}`);
        return response.data;
    },
    sendMessage: async (data) => {
        // Endpoint expects: { conversationId (optional), receiverId, text }
        // The current backend createMessage controller logic:
        // const { conversationId, receiverId, text } = req.body;
        const response = await api.post("/messages/create-message", data);
        return response.data;
    }
};
