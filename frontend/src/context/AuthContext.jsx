import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";
import { storage } from "../utils/storage.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [token, setToken] = useState(storage.getToken());
  const [loading, setLoading] = useState(Boolean(storage.getToken()));

  const saveSession = ({ token: nextToken, user: nextUser }) => {
    storage.setToken(nextToken);
    storage.setUser(nextUser);
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    storage.clearAuth();
    setToken(null);
    setUser(null);
  };

  const login = async (payload) => {
    const { data } = await authService.login(payload);
    saveSession(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    saveSession(data);
    return data;
  };

  const logout = () => {
    clearSession();
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authService.getMe();
        setUser(data.user);
        storage.setUser(data.user);
      } catch (error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
};
