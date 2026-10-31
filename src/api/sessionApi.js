import axiosInstance from "../utils/axiosInstance";

export const getSessions = (params) => axiosInstance.get("/sessions", { params }).then((r) => r.data);
export const getPlanSessions = (planId, params) => axiosInstance.get(`/sessions/plan/${planId}`, { params }).then((r) => r.data);
export const updateSessionStatus = (id, data) => axiosInstance.patch(`/sessions/${id}/status`, data).then((r) => r.data);
