import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { startRouteLoading, stopRouteLoading } from "../../store/slices/uiSlice";

/**
 * Shows the global brand loader briefly on client-side route changes
 * until the new page has had a chance to paint.
 */
export default function RouteLoadingBridge() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    dispatch(startRouteLoading({ message: "Loading page..." }));

    let timeoutId;
    const frameId = requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => {
        dispatch(stopRouteLoading());
      }, 280);
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (timeoutId) window.clearTimeout(timeoutId);
      dispatch(stopRouteLoading());
    };
  }, [location.pathname, location.search, dispatch]);

  return null;
}
