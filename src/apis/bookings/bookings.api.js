import apiClient from "../client";

export async function getBookings(params = {}) {
  const { data } = await apiClient.get("/bookings", { params });
  return data;
}

export async function getBookingById(bookingId) {
  const { data } = await apiClient.get(`/bookings/${bookingId}`);
  return data;
}

export async function createBooking(payload) {
  const { data } = await apiClient.post("/bookings", payload);
  return data;
}

export async function cancelBooking(bookingId) {
  const { data } = await apiClient.patch(`/bookings/${bookingId}/cancel`);
  return data;
}
