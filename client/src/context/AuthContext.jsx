import { createContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("smartspend_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("smartspend_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("smartspend_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("smartspend_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem("smartspend_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser: loadUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
