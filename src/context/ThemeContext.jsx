import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { accentColors } from "@onesaz/tokens";
import {
  DEFAULT_ACCENT,
  DEFAULT_THEME_MODE,
  STORAGE_KEYS,
} from "../constants";

const ThemeContext = createContext(null);

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyAccent(accent, resolved) {
  const scale = accentColors[accent] || accentColors[DEFAULT_ACCENT];
  const isDark = resolved === "dark";
  const root = document.documentElement;

  root.setAttribute("data-accent", accent);
  root.style.setProperty("--app-accent", isDark ? scale[6] : scale[8]);
  root.style.setProperty("--app-accent-2", isDark ? scale[5] : scale[7]);
  root.style.setProperty("--app-accent-soft", isDark ? `${scale[6]}33` : `${scale[8]}1f`);
  root.style.setProperty("--app-accent-text", isDark ? scale[4] : scale[9]);
  root.style.setProperty(
    "--app-bg-accent",
    isDark
      ? `radial-gradient(ellipse at top right, ${scale[6]}2e, transparent 45%), radial-gradient(ellipse at bottom left, ${scale[5]}1a, transparent 40%)`
      : `radial-gradient(ellipse at top right, ${scale[8]}1f, transparent 45%), radial-gradient(ellipse at bottom left, ${scale[6]}14, transparent 40%)`
  );
}

function applyTheme(mode, accent) {
  const resolved = mode === "system" ? getSystemTheme() : mode;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
  applyAccent(accent, resolved);
  return resolved;
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(
    () => localStorage.getItem(STORAGE_KEYS.THEME_MODE) || DEFAULT_THEME_MODE
  );
  const [accent, setAccentState] = useState(
    () => localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || DEFAULT_ACCENT
  );
  const [resolved, setResolved] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const initialMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE) || DEFAULT_THEME_MODE;
    const initialAccent = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || DEFAULT_ACCENT;
    return applyTheme(initialMode, initialAccent);
  });

  const setMode = useCallback(
    (next) => {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, next);
      setModeState(next);
      setResolved(applyTheme(next, accent));
    },
    [accent]
  );

  const setAccent = useCallback(
    (next) => {
      localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, next);
      setAccentState(next);
      setResolved(applyTheme(mode, next));
    },
    [mode]
  );

  useEffect(() => {
    setResolved(applyTheme(mode, accent));

    if (mode !== "system") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(applyTheme("system", accent));
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode, accent]);

  const value = useMemo(
    () => ({
      mode,
      resolved,
      accent,
      setMode,
      setAccent,
      isDark: resolved === "dark",
    }),
    [mode, resolved, accent, setMode, setAccent]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
