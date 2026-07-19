import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectDashboard,
  selectDashboardError,
  selectDashboardLoading,
  selectDashboardStats,
} from "../store/selectors";
import { fetchDashboard } from "../store/slices/dashboardSlice";

export function useDashboard(autoLoad = true) {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector(selectDashboard);
  const stats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  const reload = useCallback(() => dispatch(fetchDashboard()), [dispatch]);

  useEffect(() => {
    if (autoLoad) reload();
  }, [autoLoad, reload]);

  return { dashboard, stats, loading, error, reload };
}
