import React, { createContext, useState, useEffect } from "react";
import API from "../services/API";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id });
      } catch {}
    }
  }, []);

  const login = async (username, password) => {
    const res = await API.post("/login", { username, password });
    localStorage.setItem("token", res.data.token);
    setUser({ id: jwtDecode(res.data.token).id });
  };

  const register = async (username, password) => {
    await API.post("/register", { username, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};