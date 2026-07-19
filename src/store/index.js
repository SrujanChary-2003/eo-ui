import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import eventsReducer from "./slices/eventsSlice";
import vendorsReducer from "./slices/vendorsSlice";
import vendorWorkspaceReducer from "./slices/vendorWorkspaceSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    events: eventsReducer,
    vendors: vendorsReducer,
    vendorWorkspace: vendorWorkspaceReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["vendorWorkspace/uploadProof/fulfilled"],
      },
    }),
});

export default store;
