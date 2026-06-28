import apiClient from "../client";

export async function getProfile() {
  const { data } = await apiClient.get("/profile");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await apiClient.patch("/profile", payload);
  return data;
}

export async function uploadDocument(formData) {
  const { data } = await apiClient.post("/profile/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
