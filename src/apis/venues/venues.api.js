import apiClient from "../client";

export async function getVenues(params = {}) {
  const { data } = await apiClient.get("/venues", { params });
  return data;
}

export async function getVenueById(venueId) {
  const { data } = await apiClient.get(`/venues/${venueId}`);
  return data;
}

export async function searchVenues(query) {
  const { data } = await apiClient.get("/venues/search", { params: { q: query } });
  return data;
}
