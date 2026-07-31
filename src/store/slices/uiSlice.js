import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  /** In-flight API requests tracked by axios interceptors */
  pendingRequests: 0,
  /** True while a client-side route transition is settling */
  routeLoading: false,
  /** Manual locks from pages/components (dynamic sections) */
  manualLocks: 0,
  /** Optional status label shown under the brand spinner */
  message: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    beginRequest(state) {
      state.pendingRequests += 1;
    },
    endRequest(state) {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
    startRouteLoading(state, action) {
      state.routeLoading = true;
      if (action.payload?.message) state.message = action.payload.message;
    },
    stopRouteLoading(state) {
      state.routeLoading = false;
      if (state.pendingRequests === 0 && state.manualLocks === 0) {
        state.message = "";
      }
    },
    startLoading(state, action) {
      state.manualLocks += 1;
      if (action.payload?.message) state.message = action.payload.message;
    },
    stopLoading(state) {
      state.manualLocks = Math.max(0, state.manualLocks - 1);
      if (state.pendingRequests === 0 && !state.routeLoading && state.manualLocks === 0) {
        state.message = "";
      }
    },
    setLoadingMessage(state, action) {
      state.message = action.payload || "";
    },
    resetLoading(state) {
      state.pendingRequests = 0;
      state.routeLoading = false;
      state.manualLocks = 0;
      state.message = "";
    },
  },
});

export const {
  beginRequest,
  endRequest,
  startRouteLoading,
  stopRouteLoading,
  startLoading,
  stopLoading,
  setLoadingMessage,
  resetLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
