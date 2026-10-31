import axiosInstance from "../utils/axiosInstance";

export const getTherapyPlans = (params) => axiosInstance.get("/therapy-plans", { params }).then((r) => r.data);
export const getTherapyPlan = (id) => axiosInstance.get(`/therapy-plans/${id}`).then((r) => r.data);
export const createTherapyPlan = (data) => axiosInstance.post("/therapy-plans", data).then((r) => r.data);
