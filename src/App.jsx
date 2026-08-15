import { useEffect } from "react";
import {
  ThemeProvider as OnesazThemeProvider,
  useTheme as useOnesazTheme,
} from "@onesaz/ui";
import { SnackbarProvider } from "notistack";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { DEFAULT_ACCENT, STORAGE_KEYS } from "./constants";
import GlobalBrandLoader from "./components/ui/GlobalBrandLoader";

function OnesazSync({ children }) {
  const { mode, accent } = useTheme();
  const { setTheme, setAccentColor } = useOnesazTheme();

  useEffect(() => {
    setTheme(mode);
  }, [mode, setTheme]);

  useEffect(() => {
    setAccentColor(accent || DEFAULT_ACCENT);
  }, [accent, setAccentColor]);

  return children;
}

function OnesazBridge({ children }) {
  const { mode, accent } = useTheme();
  return (
    <OnesazThemeProvider
      defaultTheme={mode}
      accentColor={accent || DEFAULT_ACCENT}
      grayColor="slate"
      radius="medium"
      storageKey={STORAGE_KEYS.ONESAZ_THEME}
    >
      <OnesazSync>{children}</OnesazSync>
    </OnesazThemeProvider>
  );
}

const App = () => {
  return (
    <ThemeProvider>
      <OnesazBridge>
        <SnackbarProvider
          maxSnack={4}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={2500}
          preventDuplicate
        >
          <GlobalBrandLoader />
          <AppRoutes />
          <SpeedInsights />
        </SnackbarProvider>
      </OnesazBridge>
    </ThemeProvider>
  );
};

export default App;
