import { enqueueSnackbar, closeSnackbar } from "notistack";

export function toast(message, variant = "default", options = {}) {
  if (!message) return null;
  return enqueueSnackbar(String(message), {
    variant,
    autoHideDuration: variant === "error" ? 4000 : 2500,
    ...options,
  });
}

export function toastSuccess(message, options) {
  return toast(message, "success", options);
}

export function toastError(message, options) {
  return toast(message, "error", options);
}

export function toastInfo(message, options) {
  return toast(message, "info", options);
}

export function toastWarning(message, options) {
  return toast(message, "warning", options);
}

export { closeSnackbar };
