import axiosInstance from "../utils/axiosInstance";

export const getUsers = () => axiosInstance.get("/users").then((r) => r.data);
export const createUser = (data) => axiosInstance.post("/users", data).then((r) => r.data);
export const toggleUserStatus = (id) => axiosInstance.patch(`/users/${id}/status`).then((r) => r.data);
