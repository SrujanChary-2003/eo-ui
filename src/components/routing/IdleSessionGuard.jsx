import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { IDLE_TIMEOUT_MINUTES } from "../../utils/pagination";

const IDLE_MS = IDLE_TIMEOUT_MINUTES * 60 * 1000;
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "click"];

export default function IdleSessionGuard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const expire = async () => {
      await logout();
      if (!location.pathname.includes("/signin")) {
        navigate("/signin", { replace: true, state: { idle: true } });
      }
    };

    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(expire, IDLE_MS);
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, reset, { passive: true });
    });
    reset();

    return () => {
      clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, reset);
      });
    };
  }, [isAuthenticated, logout, navigate, location.pathname]);

  return null;
}
