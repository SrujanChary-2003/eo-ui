import apiClient from "../client";

export async function getVendors(params = {}) {
  const { data } = await apiClient.get("/vendors", { params });
  return data;
}

export async function getVendorById(vendorId) {
  const { data } = await apiClient.get(`/vendors/${vendorId}`);
  return data;
}

export async function searchVendors(query) {
  const { data } = await apiClient.get("/vendors/search", { params: { q: query } });
  return data;
}
