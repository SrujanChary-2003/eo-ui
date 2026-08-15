import { PAGE_SIZE as DEFAULT_PAGE_SIZE, IDLE_TIMEOUT_MINUTES as DEFAULT_IDLE } from "../constants";

export const PAGE_SIZE = DEFAULT_PAGE_SIZE;
export const IDLE_TIMEOUT_MINUTES = DEFAULT_IDLE;

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
