import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
} from "../store/selectors";
import {
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  verifyUserEmail,
} from "../store/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const login = useCallback(
    async (credentials) => {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.rejected.match(result)) {
        const error = new Error(result.payload?.message || "Login failed");
        error.response = { data: result.payload };
        throw error;
      }
      return { data: { user: result.payload } };
    },
    [dispatch]
  );

  const register = useCallback(
    async (payload) => {
      const result = await dispatch(registerUser(payload));
      if (registerUser.rejected.match(result)) {
        const error = new Error(result.payload?.message || "Registration failed");
        error.response = { data: result.payload };
        throw error;
      }
      return result.payload;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const verifyEmail = useCallback(
    async (payload) => {
      const result = await dispatch(verifyUserEmail(payload));
      if (verifyUserEmail.rejected.match(result)) {
        const error = new Error(result.payload?.message || "Verification failed");
        error.response = { data: result.payload };
        throw error;
      }
      return result.payload;
    },
    [dispatch]
  );

  const resendVerification = useCallback(
    async (email) => {
      const result = await dispatch(resendVerificationEmail(email));
      if (resendVerificationEmail.rejected.match(result)) {
        const error = new Error(result.payload?.message || "Resend failed");
        error.response = { data: result.payload };
        throw error;
      }
      return result.payload;
    },
    [dispatch]
  );

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
  };
}
