import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as adminApi from "../../apis/admin/admin.api";
import { emptyPagination, readPagination } from "../../utils/pagination";

export const fetchAdminUsers = createAsyncThunk("admin/users", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await adminApi.getUsers(params);
    return {
      users: response.data?.users || [],
      pagination: readPagination(response.data),
    };
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load users" });
  }
});

export const toggleSuspendUser = createAsyncThunk("admin/suspend", async (userId, { rejectWithValue }) => {
  try {
    const response = await adminApi.suspendUser(userId);
    return response.data?.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to update user" });
  }
});

export const fetchAdminVendors = createAsyncThunk(
  "admin/vendors",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAdminVendors(params);
      return {
        vendors: response.data?.vendors || [],
        pagination: readPagination(response.data),
      };
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
      return response.data?.vendor;
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
      return {
        events: response.data?.events || [],
        pagination: readPagination(response.data),
      };
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
      return response.data?.event;
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
    usersPagination: emptyPagination,
    vendorsPagination: emptyPagination,
    eventsPagination: emptyPagination,
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
    extraReducers: (builder) => {
    const fail = (state, action, fallback) => {
      state.loading = false;
      state.error = action.payload?.message || fallback;
    };
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload?.users) ? action.payload.users : [];
        state.usersPagination = action.payload?.pagination || emptyPagination;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => fail(state, action, "Failed to load users"))
      .addCase(toggleSuspendUser.fulfilled, (state, action) => {
        if (!action.payload?.id) return;
        state.users = state.users.map((u) => (u?.id === action.payload.id ? action.payload : u));
      })
      .addCase(toggleSuspendUser.rejected, (state, action) => fail(state, action, "Failed to update user"))
      .addCase(fetchAdminVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = Array.isArray(action.payload?.vendors) ? action.payload.vendors : [];
        state.vendorsPagination = action.payload?.pagination || emptyPagination;
      })
      .addCase(fetchAdminVendors.rejected, (state, action) => fail(state, action, "Failed to load vendors"))
      .addCase(reviewAdminVendor.fulfilled, (state, action) => {
        if (!action.payload?.id) return;
        state.vendors = state.vendors.map((v) =>
          v?.id === action.payload.id ? { ...v, ...action.payload } : v
        );
      })
      .addCase(reviewAdminVendor.rejected, (state, action) => fail(state, action, "Failed to review vendor"))
      .addCase(fetchAdminEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = Array.isArray(action.payload?.events) ? action.payload.events : [];
        state.eventsPagination = action.payload?.pagination || emptyPagination;
      })
      .addCase(fetchAdminEvents.rejected, (state, action) => fail(state, action, "Failed to load events"))
      .addCase(reviewAdminEvent.fulfilled, (state, action) => {
        if (!action.payload?.id) return;
        state.events = state.events.map((e) => (e?.id === action.payload.id ? action.payload : e));
      })
      .addCase(reviewAdminEvent.rejected, (state, action) => fail(state, action, "Failed to review event"));
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
