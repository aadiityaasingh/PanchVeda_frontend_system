import { createContext, useContext, useState } from "react";

import { loginUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = async (data) => {
    const response = await loginUser(data);

    localStorage.setItem("token", response.token);

    localStorage.setItem("user", JSON.stringify(response.user));

    setUser(response.user);
  };

  const logout = () => {
    localStorage.clear();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        login,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
