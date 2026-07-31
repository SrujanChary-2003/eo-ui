import apiClient from "../client";

export async function getProfile() {
  const { data } = await apiClient.get("/profile");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await apiClient.patch("/profile", payload);
  return data;
}

export async function uploadAvatar(image) {
  const { data } = await apiClient.post("/profile/avatar", { image });
  return data;
}

export async function deleteAvatar() {
  const { data } = await apiClient.delete("/profile/avatar");
  return data;
}
