import apiClient from "../client";

export async function getVendorDashboard() {
  const { data } = await apiClient.get("/vendor/dashboard");
  return data;
}

export async function getVendorProfile() {
  const { data } = await apiClient.get("/vendor/profile");
  return data;
}

export async function updateVendorProfile(payload) {
  const { data } = await apiClient.patch("/vendor/profile", payload);
  return data;
}

export async function getVendorBookings(params = {}) {
  const { data } = await apiClient.get("/vendor/bookings", { params });
  return data;
}

export async function acceptBooking(bookingId) {
  const { data } = await apiClient.patch(`/vendor/bookings/${bookingId}/accept`);
  return data;
}

export async function declineBooking(bookingId) {
  const { data } = await apiClient.patch(`/vendor/bookings/${bookingId}/decline`);
  return data;
}

export async function getVendorServices(params = {}) {
  const { data } = await apiClient.get("/vendor/services", { params });
  return data;
}

export async function createVendorService(payload) {
  const { data } = await apiClient.post("/vendor/services", payload);
  return data;
}

export async function updateVendorService(serviceId, payload) {
  const { data } = await apiClient.patch(`/vendor/services/${serviceId}`, payload);
  return data;
}

export async function deleteVendorService(serviceId) {
  const { data } = await apiClient.delete(`/vendor/services/${serviceId}`);
  return data;
}

export async function updateVendorAvailability(payload) {
  const { data } = await apiClient.patch("/vendor/availability", payload);
  return data;
}

export async function uploadPortfolio(payload) {
  const { data } = await apiClient.post("/vendor/portfolio", payload);
  return data;
}

export async function deletePortfolioItem(proofId) {
  const { data } = await apiClient.delete(`/vendor/portfolio/${proofId}`);
  return data;
}
