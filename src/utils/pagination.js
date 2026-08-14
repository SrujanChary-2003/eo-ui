export const PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE) || 12;
export const IDLE_TIMEOUT_MINUTES = Number(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES) || 30;

export const emptyPagination = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

export function readPagination(payload) {
  const pagination = payload?.pagination || {};
  return {
    page: Number(pagination.page) || 1,
    limit: Number(pagination.limit) || PAGE_SIZE,
    total: Number(pagination.total) || 0,
    totalPages: Number(pagination.totalPages) || 1,
    hasNext: Boolean(pagination.hasNext),
    hasPrev: Boolean(pagination.hasPrev),
  };
}
