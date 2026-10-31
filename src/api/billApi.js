import axiosInstance from "../utils/axiosInstance";

export const getBills = () => axiosInstance.get("/bills").then((r) => r.data);
export const getBillByPlan = (planId) => axiosInstance.get(`/bills/plan/${planId}`).then((r) => r.data);
export const addPayment = (id, amount) => axiosInstance.patch(`/bills/${id}/pay`, { amount: Number(amount) }).then((r) => r.data);
