import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCurrentEvent,
  selectEventCatalog,
  selectEventDetailLoading,
  selectEvents,
  selectEventsError,
  selectEventsLoading,
  selectEventsPagination,
} from "../store/selectors";
import {
  clearCurrentEvent,
  createEvent,
  fetchCatalog,
  fetchEventById,
  fetchEvents,
  removeEvent,
  selectEventVendors,
  updateEvent,
} from "../store/slices/eventsSlice";

export function useEvents(autoLoad = true) {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const pagination = useAppSelector(selectEventsPagination);
  const current = useAppSelector(selectCurrentEvent);
  const catalog = useAppSelector(selectEventCatalog);
  const loading = useAppSelector(selectEventsLoading);
  const detailLoading = useAppSelector(selectEventDetailLoading);
  const error = useAppSelector(selectEventsError);

  const loadEvents = useCallback((params) => dispatch(fetchEvents(params)), [dispatch]);
  const loadCatalog = useCallback(() => dispatch(fetchCatalog()), [dispatch]);
  const loadEvent = useCallback((id) => dispatch(fetchEventById(id)), [dispatch]);
  const resetCurrent = useCallback(() => dispatch(clearCurrentEvent()), [dispatch]);

  useEffect(() => {
    if (autoLoad) loadEvents();
  }, [autoLoad, loadEvents]);

  const create = useCallback(
    async (payload) => {
      const result = await dispatch(createEvent(payload));
      if (createEvent.rejected.match(result)) {
        const error = new Error(result.payload?.message || "Create failed");
        error.response = { data: result.payload };
        throw error;
      }
      return result.payload;
    },
    [dispatch]
  );

  const update = useCallback(
    async (eventId, payload) => {
      const result = await dispatch(updateEvent({ eventId, payload }));
      if (updateEvent.rejected.match(result)) {
        const error = new Error(result.payload?.message || "Update failed");
        error.response = { data: result.payload };
        throw error;
      }
      return result.payload;
    },
    [dispatch]
  );

  const selectVendors = useCallback(
    async (eventId, selections) => {
      const result = await dispatch(selectEventVendors({ eventId, selections }));
      if (selectEventVendors.rejected.match(result)) {
        const error = new Error(result.payload?.message || "Select vendors failed");
        error.response = { data: result.payload };
        throw error;
      }
      return result.payload;
    },
    [dispatch]
  );

  const remove = useCallback(
    async (eventId) => {
      const result = await dispatch(removeEvent(eventId));
      if (removeEvent.rejected.match(result)) {
        const error = new Error(result.payload?.message || "Delete failed");
        error.response = { data: result.payload };
        throw error;
      }
      return result.payload;
    },
    [dispatch]
  );

  return {
    events,
    pagination,
    current,
    catalog,
    loading,
    detailLoading,
    error,
    loadEvents,
    loadCatalog,
    loadEvent,
    resetCurrent,
    create,
    update,
    selectVendors,
    remove,
  };
}
