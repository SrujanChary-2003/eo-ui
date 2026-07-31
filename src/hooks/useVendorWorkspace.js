import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectVendorBookings,
  selectVendorProfile,
  selectVendorServices,
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
  const message = useAppSelector(selectVendorWorkspaceMessage);
  const error = useAppSelector(selectVendorWorkspaceError);

  const loadProfile = useCallback(() => dispatch(fetchVendorProfile()), [dispatch]);
  const loadServices = useCallback(() => dispatch(fetchVendorServices()), [dispatch]);
  const loadBookings = useCallback(() => dispatch(fetchVendorBookings()), [dispatch]);

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
      return response.data.profile;
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
      await dispatch(removeVendorService(id));
    },
    [dispatch]
  );

  const respondBooking = useCallback(
    async (bookingId, accept) => {
      await dispatch(respondVendorBooking({ bookingId, accept }));
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
