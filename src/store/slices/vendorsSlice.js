import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as vendorsApi from "../../apis/vendors/vendors.api";

export const fetchVendors = createAsyncThunk("vendors/list", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await vendorsApi.getVendors(params);
    return response.data.vendors || [];
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load vendors" });
  }
});

export const fetchVendorById = createAsyncThunk("vendors/detail", async (vendorId, { rejectWithValue }) => {
  try {
    const response = await vendorsApi.getVendorById(vendorId);
    return response.data.vendor;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Vendor not found" });
  }
});

const vendorsSlice = createSlice({
  name: "vendors",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearVendorsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load vendors";
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.error = action.payload?.message || "Vendor not found";
      });
  },
});

export const { clearVendorsError } = vendorsSlice.actions;
export default vendorsSlice.reducer;
