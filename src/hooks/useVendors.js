import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCurrentVendor,
  selectVendors,
  selectVendorsError,
  selectVendorsLoading,
} from "../store/selectors";
import { fetchVendorById, fetchVendors } from "../store/slices/vendorsSlice";

export function useVendors(autoLoad = false) {
  const dispatch = useAppDispatch();
  const vendors = useAppSelector(selectVendors);
  const current = useAppSelector(selectCurrentVendor);
  const loading = useAppSelector(selectVendorsLoading);
  const error = useAppSelector(selectVendorsError);

  const load = useCallback(
    (nextParams = {}) => dispatch(fetchVendors(nextParams)),
    [dispatch]
  );

  const loadOne = useCallback((id) => dispatch(fetchVendorById(id)), [dispatch]);

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  return { vendors, current, loading, error, load, loadOne };
}
