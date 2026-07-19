import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as adminApi from "../../apis/admin/admin.api";

export const fetchAdminUsers = createAsyncThunk("admin/users", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await adminApi.getUsers(params);
    return response.data.users || [];
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load users" });
  }
});

export const toggleSuspendUser = createAsyncThunk("admin/suspend", async (userId, { rejectWithValue }) => {
  try {
    const response = await adminApi.suspendUser(userId);
    return response.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to update user" });
  }
});

export const fetchAdminVendors = createAsyncThunk(
  "admin/vendors",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAdminVendors(params);
      return response.data.vendors || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to load vendors" });
    }
  }
);

export const reviewAdminVendor = createAsyncThunk(
  "admin/reviewVendor",
  async ({ vendorId, approve, adminNote }, { rejectWithValue }) => {
    try {
      const response = await adminApi.verifyVendor(vendorId, { approve, adminNote });
      return response.data.vendor;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to review vendor" });
    }
  }
);

export const fetchAdminEvents = createAsyncThunk(
  "admin/events",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAdminEvents(params);
      return response.data.events || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to load events" });
    }
  }
);

export const reviewAdminEvent = createAsyncThunk(
  "admin/reviewEvent",
  async ({ eventId, approve, adminNote }, { rejectWithValue }) => {
    try {
      const response = await adminApi.reviewEvent(eventId, { approve, adminNote });
      return response.data.event;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to review event" });
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    vendors: [],
    events: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(toggleSuspendUser.fulfilled, (state, action) => {
        state.users = state.users.map((u) => (u.id === action.payload.id ? action.payload : u));
      })
      .addCase(fetchAdminVendors.fulfilled, (state, action) => {
        state.vendors = action.payload;
      })
      .addCase(reviewAdminVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.map((v) => (v.id === action.payload.id ? { ...v, ...action.payload } : v));
      })
      .addCase(fetchAdminEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      })
      .addCase(reviewAdminEvent.fulfilled, (state, action) => {
        state.events = state.events.map((e) => (e.id === action.payload.id ? action.payload : e));
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
