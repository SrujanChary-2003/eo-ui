import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import ThemeControls from "../components/theme/ThemeControls";
import { APP_NAME, APP_SHORT_NAME } from "../constants";

function RobotMark() {
  return (
    <svg
      viewBox="0 0 220 220"
      className="h-40 w-40 sm:h-48 sm:w-48"
      role="img"
      aria-label="Friendly robot"
    >
      <title>Friendly robot</title>
      <ellipse cx="110" cy="198" rx="54" ry="10" fill="var(--app-border)" />
      <rect x="104" y="28" width="12" height="28" rx="6" fill="var(--app-accent)" />
      <circle cx="110" cy="22" r="10" fill="var(--app-accent)" />
      <circle cx="110" cy="22" r="4" fill="white" />
      <rect x="42" y="56" width="136" height="118" rx="36" fill="var(--app-surface)" stroke="var(--app-border)" strokeWidth="3" />
      <rect x="62" y="78" width="96" height="52" rx="18" fill="var(--app-surface-muted)" />
      <circle cx="88" cy="104" r="12" fill="var(--app-accent)" />
      <circle cx="132" cy="104" r="12" fill="var(--app-accent)" />
      <circle cx="85" cy="101" r="4" fill="white" />
      <circle cx="129" cy="101" r="4" fill="white" />
      <rect x="90" y="144" width="40" height="10" rx="5" fill="var(--app-accent-soft)" />
      <rect x="18" y="92" width="22" height="44" rx="11" fill="var(--app-accent-soft)" stroke="var(--app-border)" strokeWidth="2" />
      <rect x="180" y="92" width="22" height="44" rx="11" fill="var(--app-accent-soft)" stroke="var(--app-border)" strokeWidth="2" />
    </svg>
  );
}

export default function NotFoundPage({
  code = "404",
  title = "Page not found",
  subtitle = "This EventSphere page does not exist, or it may have moved. You can go back, refresh, or return home — we will get you somewhere familiar.",
  embedded = false,
}) {
  const navigate = useNavigate();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const refresh = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const content = (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <RobotMark />
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--app-accent-text)]">
        {code}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--app-text)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--app-muted)] sm:text-base">
        {subtitle}
      </p>
      <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Button variant="secondary" className="w-full sm:w-auto" onClick={goBack}>
          Go back
        </Button>
        <Button variant="secondary" className="w-full sm:w-auto" onClick={refresh}>
          Refresh
        </Button>
        <Link to="/" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Home</Button>
        </Link>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="app-shell min-h-screen">
      <header className="app-navbar sticky top-0 z-50 w-full border-b">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--app-accent)] text-sm font-bold text-white">
              {APP_SHORT_NAME}
            </span>
            <span className="truncate text-base font-semibold tracking-tight text-[var(--app-text)] sm:text-lg">
              {APP_NAME}
            </span>
          </Link>
          <ThemeControls />
        </div>
      </header>
      {content}
    </div>
  );
}
