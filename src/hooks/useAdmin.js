import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectAdminError,
  selectAdminEvents,
  selectAdminUsers,
  selectAdminVendors,
} from "../store/selectors";
import {
  fetchAdminEvents,
  fetchAdminUsers,
  fetchAdminVendors,
  reviewAdminEvent,
  reviewAdminVendor,
  toggleSuspendUser,
} from "../store/slices/adminSlice";

export function useAdmin() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAdminUsers);
  const vendors = useAppSelector(selectAdminVendors);
  const events = useAppSelector(selectAdminEvents);
  const error = useAppSelector(selectAdminError);

  const loadUsers = useCallback((params) => dispatch(fetchAdminUsers(params)), [dispatch]);
  const loadVendors = useCallback((params) => dispatch(fetchAdminVendors(params)), [dispatch]);
  const loadEvents = useCallback((params) => dispatch(fetchAdminEvents(params)), [dispatch]);

  useEffect(() => {
    // no auto-load; pages request what they need
  }, []);

  const suspend = useCallback(async (userId) => dispatch(toggleSuspendUser(userId)), [dispatch]);

  const reviewVendor = useCallback(
    async (vendorId, approve, adminNote) =>
      dispatch(reviewAdminVendor({ vendorId, approve, adminNote })),
    [dispatch]
  );

  const reviewEvent = useCallback(
    async (eventId, approve, adminNote) =>
      dispatch(reviewAdminEvent({ eventId, approve, adminNote })),
    [dispatch]
  );

  return {
    users,
    vendors,
    events,
    error,
    loadUsers,
    loadVendors,
    loadEvents,
    suspend,
    reviewVendor,
    reviewEvent,
  };
}
