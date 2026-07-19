import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as vendorApi from "../../apis/vendor/vendor.api";

export const fetchVendorProfile = createAsyncThunk(
  "vendorWorkspace/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorApi.getVendorProfile();
      return response.data.profile;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to load profile" });
    }
  }
);

export const saveVendorProfile = createAsyncThunk(
  "vendorWorkspace/saveProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await vendorApi.updateVendorProfile(payload);
      return response.data.profile;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to save profile" });
    }
  }
);

export const fetchVendorServices = createAsyncThunk(
  "vendorWorkspace/services",
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorApi.getVendorServices();
      return response.data.services || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to load services" });
    }
  }
);

export const addVendorService = createAsyncThunk(
  "vendorWorkspace/addService",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await vendorApi.createVendorService(payload);
      return response.data.service;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to add service" });
    }
  }
);

export const removeVendorService = createAsyncThunk(
  "vendorWorkspace/removeService",
  async (serviceId, { rejectWithValue }) => {
    try {
      await vendorApi.deleteVendorService(serviceId);
      return serviceId;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to delete service" });
    }
  }
);

export const fetchVendorBookings = createAsyncThunk(
  "vendorWorkspace/bookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorApi.getVendorBookings();
      return response.data.bookings || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to load bookings" });
    }
  }
);

export const respondVendorBooking = createAsyncThunk(
  "vendorWorkspace/respondBooking",
  async ({ bookingId, accept }, { rejectWithValue }) => {
    try {
      if (accept) await vendorApi.acceptBooking(bookingId);
      else await vendorApi.declineBooking(bookingId);
      return { bookingId, accept };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to update booking" });
    }
  }
);

export const uploadVendorProof = createAsyncThunk(
  "vendorWorkspace/uploadProof",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await vendorApi.uploadPortfolio(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to upload proof" });
    }
  }
);

export const deleteVendorProof = createAsyncThunk(
  "vendorWorkspace/deleteProof",
  async (proofId, { rejectWithValue }) => {
    try {
      await vendorApi.deletePortfolioItem(proofId);
      return proofId;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to delete proof" });
    }
  }
);

const vendorWorkspaceSlice = createSlice({
  name: "vendorWorkspace",
  initialState: {
    profile: null,
    services: [],
    bookings: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearVendorWorkspaceMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(saveVendorProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.message = "Profile saved";
      })
      .addCase(fetchVendorServices.fulfilled, (state, action) => {
        state.services = action.payload;
      })
      .addCase(addVendorService.fulfilled, (state, action) => {
        state.services = [action.payload, ...state.services];
        state.message = "Service added";
      })
      .addCase(removeVendorService.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s.id !== action.payload);
      })
      .addCase(fetchVendorBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })
      .addCase(uploadVendorProof.fulfilled, (state, action) => {
        if (action.payload?.profile) state.profile = action.payload.profile;
        state.message = "Proof uploaded";
      })
      .addCase(deleteVendorProof.fulfilled, (state, action) => {
        if (state.profile?.portfolio) {
          state.profile.portfolio = state.profile.portfolio.filter((p) => p.id !== action.payload);
        }
        if (state.profile?.portfolioUrls) {
          state.profile.portfolioUrls = state.profile.portfolioUrls.filter(
            (url) => !String(url).includes(action.payload)
          );
        }
      });
  },
});

export const { clearVendorWorkspaceMessage } = vendorWorkspaceSlice.actions;
export default vendorWorkspaceSlice.reducer;
