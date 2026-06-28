import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../APIs/auth/auth.api";
import { getAccessToken, setAccessToken } from "../APIs/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      setUser(response.data.user);
    } catch {
      try {
        const refreshed = await authApi.refreshToken();
        setUser(refreshed.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    setUser(response.data.user);
    return response;
  }, []);

  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const verifyEmail = useCallback(async (payload) => {
    return authApi.verifyEmail(payload);
  }, []);

  const resendVerification = useCallback(async (email) => {
    return authApi.resendVerification(email);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      verifyEmail,
      resendVerification,
    }),
    [user, loading, login, register, logout, verifyEmail, resendVerification]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
