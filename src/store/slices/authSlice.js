import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../../apis/auth/auth.api";
import { getAccessToken, setAccessToken } from "../../apis/client";

export const bootstrapAuth = createAsyncThunk("auth/bootstrap", async (_, { rejectWithValue }) => {
  try {
    const token = getAccessToken();
    if (token) {
      try {
        const response = await authApi.getCurrentUser();
        return response.data?.user;
      } catch {
        // continue to refresh
      }
    }
    const refreshed = await authApi.refreshToken();
    return refreshed.data?.user;
  } catch (err) {
    setAccessToken(null);
    return rejectWithValue(err.response?.data || { message: "Session expired" });
  }
});

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    return response.data?.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Login failed" });
  }
});

export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.register(payload);
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Registration failed" });
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
});

export const verifyUserEmail = createAsyncThunk("auth/verifyEmail", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.verifyEmail(payload);
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Verification failed" });
  }
});

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      return await authApi.resendVerification(email);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Resend failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.loading = false;
        if (!state.user) state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
