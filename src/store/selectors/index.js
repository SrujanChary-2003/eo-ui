export const selectAuthState = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectUserRole = (state) => state.auth.user?.role;

export const selectDashboard = (state) => state.dashboard.data;
export const selectDashboardStats = (state) => state.dashboard.data?.stats || {};
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;

export const selectEvents = (state) => state.events.list;
export const selectCurrentEvent = (state) => state.events.current;
export const selectEventCatalog = (state) => state.events.catalog;
export const selectEventsLoading = (state) => state.events.loading;
export const selectEventDetailLoading = (state) => state.events.detailLoading;
export const selectEventsError = (state) => state.events.error;

export const selectVendors = (state) => state.vendors.list;
export const selectCurrentVendor = (state) => state.vendors.current;
export const selectVendorsLoading = (state) => state.vendors.loading;
export const selectVendorsError = (state) => state.vendors.error;

export const selectVendorProfile = (state) => state.vendorWorkspace.profile;
export const selectVendorServices = (state) => state.vendorWorkspace.services;
export const selectVendorBookings = (state) => state.vendorWorkspace.bookings;
export const selectVendorWorkspaceMessage = (state) => state.vendorWorkspace.message;
export const selectVendorWorkspaceError = (state) => state.vendorWorkspace.error;

export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminVendors = (state) => state.admin.vendors;
export const selectAdminEvents = (state) => state.admin.events;
export const selectAdminError = (state) => state.admin.error;

export const selectUiState = (state) => state.ui;
export const selectGlobalLoadingMessage = (state) => state.ui.message;
export const selectIsGlobalLoading = (state) =>
  state.ui.pendingRequests > 0 ||
  state.ui.routeLoading ||
  state.ui.manualLocks > 0 ||
  Boolean(state.auth.loading);
