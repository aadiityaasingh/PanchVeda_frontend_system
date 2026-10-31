/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

import { loginUser, setupInitialAdmin } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    localStorage.setItem("token", response.token);

    localStorage.setItem("user", JSON.stringify(response.user));

    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  const completeSetup = async (details) => {
    const response = await setupInitialAdmin(details);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        login,

        logout,
        completeSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
