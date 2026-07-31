import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { startLoading, stopLoading } from "../store/slices/uiSlice";

/**
 * Toggle the global brand loader from any page/section during dynamic work.
 * @example useGlobalLoading(isFetching, "Loading events...")
 */
export function useGlobalLoading(active, message = "Loading...") {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!active) return undefined;
    dispatch(startLoading({ message }));
    return () => {
      dispatch(stopLoading());
    };
  }, [active, message, dispatch]);
}

export default useGlobalLoading;
