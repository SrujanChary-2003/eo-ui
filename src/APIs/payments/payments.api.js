import apiClient from "../client";

export async function getPayments(params = {}) {
  const { data } = await apiClient.get("/payments", { params });
  return data;
}

export async function getPaymentById(paymentId) {
  const { data } = await apiClient.get(`/payments/${paymentId}`);
  return data;
}

export async function createPayment(payload) {
  const { data } = await apiClient.post("/payments", payload);
  return data;
}

export async function confirmPayment(paymentId) {
  const { data } = await apiClient.post(`/payments/${paymentId}/confirm`);
  return data;
}
