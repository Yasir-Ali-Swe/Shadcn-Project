import api from "../axios";

export const getMe = () => api.get("/auth/me");
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
