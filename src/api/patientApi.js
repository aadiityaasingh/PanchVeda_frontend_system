import axiosInstance from "../utils/axiosInstance";

export const getPatients = (params) => axiosInstance.get("/patients", { params }).then((r) => r.data);
export const getPatient = (id) => axiosInstance.get(`/patients/${id}`).then((r) => r.data);
export const createPatient = (data) => axiosInstance.post("/patients", data).then((r) => r.data);
export const updatePatient = (id, data) => axiosInstance.put(`/patients/${id}`, data).then((r) => r.data);
export const deletePatient = (id) => axiosInstance.delete(`/patients/${id}`).then((r) => r.data);
export const getPatientHistory = (id) => axiosInstance.get(`/patients/${id}/history`).then((r) => r.data);
