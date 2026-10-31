import axiosInstance from "../utils/axiosInstance.js";

export const loginUser = async (data) => {
  const response = await axiosInstance.post(
    "/auth/login",
    data
  );

  return response.data;
};

export const getSetupStatus = () => axiosInstance.get("/auth/setup-status").then((response) => response.data);
export const setupInitialAdmin = (data) => axiosInstance.post("/auth/setup", data).then((response) => response.data);
