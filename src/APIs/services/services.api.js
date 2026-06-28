import apiClient from "../client";

export async function getServices(params = {}) {
  const { data } = await apiClient.get("/services", { params });
  return data;
}

export async function getServiceById(serviceId) {
  const { data } = await apiClient.get(`/services/${serviceId}`);
  return data;
}

export async function searchServices(query) {
  const { data } = await apiClient.get("/services/search", { params: { q: query } });
  return data;
}
