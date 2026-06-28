import apiClient from "../client";

export async function getUsers(params = {}) {
  const { data } = await apiClient.get("/admin/users", { params });
  return data;
}

export async function suspendUser(userId) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/suspend`);
  return data;
}

export async function getAdminVendors(params = {}) {
  const { data } = await apiClient.get("/admin/vendors", { params });
  return data;
}

export async function verifyVendor(vendorId) {
  const { data } = await apiClient.patch(`/admin/vendors/${vendorId}/verify`);
  return data;
}

export async function deleteVendor(vendorId) {
  const { data } = await apiClient.delete(`/admin/vendors/${vendorId}`);
  return data;
}

export async function getReports(params = {}) {
  const { data } = await apiClient.get("/admin/reports", { params });
  return data;
}

export async function getAuditLogs(params = {}) {
  const { data } = await apiClient.get("/admin/logs", { params });
  return data;
}
