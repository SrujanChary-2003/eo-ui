import { useCallback, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/authSlice";
import * as profileApi from "../apis/profile/profile.api";
import { toastError, toastSuccess } from "../utils/toast";
import { getApiErrorMessage } from "../utils/authErrors";

export function useProfile() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await profileApi.getProfile();
      dispatch(setUser(response.data?.user));
      return response.data?.user;
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to load profile");
      setError(msg);
      toastError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const save = useCallback(
    async (payload) => {
      setLoading(true);
      setError("");
      setMessage("");
      try {
        const response = await profileApi.updateProfile(payload);
        dispatch(setUser(response.data?.user));
        const msg = response.message || "Profile updated";
        setMessage(msg);
        toastSuccess(msg);
        return response.data?.user;
      } catch (err) {
        const msg = getApiErrorMessage(err, "Failed to update profile");
        setError(msg);
        toastError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const uploadPhoto = useCallback(
    async (image) => {
      setLoading(true);
      setError("");
      setMessage("");
      try {
        const response = await profileApi.uploadAvatar(image);
        dispatch(setUser(response.data?.user));
        const msg = response.message || "Avatar updated";
        setMessage(msg);
        toastSuccess(msg);
        return response.data?.user;
      } catch (err) {
        const msg = getApiErrorMessage(err, "Failed to upload avatar");
        setError(msg);
        toastError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const removePhoto = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await profileApi.deleteAvatar();
      dispatch(setUser(response.data?.user));
      const msg = response.message || "Avatar removed";
      setMessage(msg);
      toastSuccess(msg);
      return response.data?.user;
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to remove avatar");
      setError(msg);
      toastError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    loading,
    error,
    message,
    refresh,
    save,
    uploadPhoto,
    removePhoto,
    clearMessage: () => setMessage(""),
  };
}
