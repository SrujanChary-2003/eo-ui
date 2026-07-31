import BrandLoader from "./BrandLoader";
import { Spinner } from "@onesaz/ui";

export function LoadingState({
  label = "Loading...",
  size = "default",
  fullPage = false,
  className = "",
  brand = true,
}) {
  if (brand) {
    return <BrandLoader label={label} fullPage={fullPage} className={className} />;
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-[var(--app-muted)] ${
        fullPage ? "min-h-screen" : "min-h-[40vh]"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <Spinner size={size} />
      {label ? <p className="text-sm text-[var(--app-muted)]">{label}</p> : null}
    </div>
  );
}

export function InlineSpinner({ size = "sm", className = "" }) {
  return <Spinner size={size} className={className} />;
}
