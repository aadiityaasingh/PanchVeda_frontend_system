import axiosInstance from "../utils/axiosInstance";

export const getTherapies = () => axiosInstance.get("/therapies").then((r) => r.data);
export const createTherapy = (data) => axiosInstance.post("/therapies", data).then((r) => r.data);
export const updateTherapy = (id, data) => axiosInstance.put(`/therapies/${id}`, data).then((r) => r.data);
export const deleteTherapy = (id) => axiosInstance.delete(`/therapies/${id}`).then((r) => r.data);
