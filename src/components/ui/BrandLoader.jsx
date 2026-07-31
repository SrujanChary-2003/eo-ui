import { APP_NAME, APP_SHORT_NAME } from "../../constants";

/**
 * Brand logo spinner used by the global overlay and full-page loading states.
 */
export default function BrandLoader({
  label = "Loading...",
  fullPage = false,
  overlay = false,
  className = "",
}) {
  const shellClass = overlay
    ? "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-[var(--app-bg)]/75 backdrop-blur-sm"
    : `flex flex-col items-center justify-center gap-4 text-[var(--app-muted)] ${
        fullPage ? "min-h-screen" : "min-h-[40vh]"
      }`;

  return (
    <div className={`${shellClass} ${className}`} role="status" aria-live="polite" aria-busy="true">
      <div className="brand-loader-mark relative flex h-16 w-16 items-center justify-center">
        <span className="brand-loader-ring absolute inset-0 rounded-2xl" aria-hidden />
        <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--app-accent)] text-base font-bold text-white shadow-lg">
          {APP_SHORT_NAME}
        </span>
      </div>
      {label ? (
        <p className="text-sm font-medium tracking-wide text-[var(--app-muted)]">
          {label}
          <span className="sr-only"> — {APP_NAME}</span>
        </p>
      ) : null}
    </div>
  );
}
