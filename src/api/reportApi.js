import axiosInstance from "../utils/axiosInstance";

export const getRevenueReport = () => axiosInstance.get("/reports/revenue").then((r) => r.data);
export const getPatientStats = () => axiosInstance.get("/reports/patient-count").then((r) => r.data);
export const getTopTherapies = () => axiosInstance.get("/reports/top-therapies").then((r) => r.data);
