import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectVendorBookings,
  selectVendorBookingsPagination,
  selectVendorProfile,
  selectVendorServices,
  selectVendorServicesPagination,
  selectVendorWorkspaceError,
  selectVendorWorkspaceMessage,
} from "../store/selectors";
import {
  addVendorService,
  clearVendorWorkspaceMessage,
  deleteVendorProof,
  fetchVendorBookings,
  fetchVendorProfile,
  fetchVendorServices,
  removeVendorService,
  respondVendorBooking,
  saveVendorProfile,
  uploadVendorProof,
} from "../store/slices/vendorWorkspaceSlice";
import { updateVendorAvailability } from "../apis/vendor/vendor.api";
import { toastError, toastSuccess } from "../utils/toast";

export function useVendorWorkspace() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectVendorProfile);
  const services = useAppSelector(selectVendorServices);
  const bookings = useAppSelector(selectVendorBookings);
  const servicesPagination = useAppSelector(selectVendorServicesPagination);
  const bookingsPagination = useAppSelector(selectVendorBookingsPagination);
  const message = useAppSelector(selectVendorWorkspaceMessage);
  const error = useAppSelector(selectVendorWorkspaceError);

  const loadProfile = useCallback(() => dispatch(fetchVendorProfile()), [dispatch]);
  const loadServices = useCallback((params) => dispatch(fetchVendorServices(params)), [dispatch]);
  const loadBookings = useCallback((params) => dispatch(fetchVendorBookings(params)), [dispatch]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (message) toastSuccess(message);
  }, [message]);

  useEffect(() => {
    if (error) toastError(typeof error === "string" ? error : error?.message || "Something went wrong");
  }, [error]);

  const saveProfile = useCallback(
    async (payload) => {
      const result = await dispatch(saveVendorProfile(payload));
      if (saveVendorProfile.rejected.match(result)) {
        const err = new Error(result.payload?.message || "Save failed");
        err.response = { data: result.payload };
        throw err;
      }
      return result.payload;
    },
    [dispatch]
  );

  const toggleAvailability = useCallback(
    async (isAvailable) => {
      const response = await updateVendorAvailability({ isAvailable });
      await dispatch(fetchVendorProfile());
      return response.data?.profile;
    },
    [dispatch]
  );

  const createService = useCallback(
    async (payload) => {
      const result = await dispatch(addVendorService(payload));
      if (addVendorService.rejected.match(result)) {
        const err = new Error(result.payload?.message || "Create failed");
        err.response = { data: result.payload };
        throw err;
      }
      return result.payload;
    },
    [dispatch]
  );

  const deleteService = useCallback(
    async (id) => {
      const result = await dispatch(removeVendorService(id));
      if (removeVendorService.rejected.match(result)) {
        const err = new Error(result.payload?.message || "Delete failed");
        err.response = { data: result.payload };
        throw err;
      }
    },
    [dispatch]
  );

  const respondBooking = useCallback(
    async (bookingId, accept) => {
      const result = await dispatch(respondVendorBooking({ bookingId, accept }));
      if (respondVendorBooking.rejected.match(result)) {
        const err = new Error(result.payload?.message || "Update failed");
        err.response = { data: result.payload };
        throw err;
      }
      await loadBookings();
    },
    [dispatch, loadBookings]
  );

  const uploadProof = useCallback(
    async (formData) => {
      const result = await dispatch(uploadVendorProof(formData));
      if (uploadVendorProof.rejected.match(result)) {
        const err = new Error(result.payload?.message || "Upload failed");
        err.response = { data: result.payload };
        throw err;
      }
      await loadProfile();
      return result.payload;
    },
    [dispatch, loadProfile]
  );

  const removeProof = useCallback(
    async (proofId) => {
      await dispatch(deleteVendorProof(proofId));
      await loadProfile();
    },
    [dispatch, loadProfile]
  );

  const clearMessage = useCallback(() => dispatch(clearVendorWorkspaceMessage()), [dispatch]);

  return {
    profile,
    services,
    bookings,
    servicesPagination,
    bookingsPagination,
    message,
    error,
    loadProfile,
    loadServices,
    loadBookings,
    saveProfile,
    toggleAvailability,
    createService,
    deleteService,
    respondBooking,
    uploadProof,
    removeProof,
    clearMessage,
  };
}
