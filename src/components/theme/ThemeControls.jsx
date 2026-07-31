import { useState } from "react";
import { NavIcon } from "../navigation/icons";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT_OPTIONS, THEME_MODES } from "../../constants";

export default function ThemeControls() {
  const { mode, setMode, accent, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const activeMode = THEME_MODES.find((item) => item.value === mode) || THEME_MODES[0];
  const activeAccent = ACCENT_OPTIONS.find((item) => item.value === accent) || ACCENT_OPTIONS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] transition hover:bg-[var(--app-surface-muted)]"
        aria-label={`Theme: ${activeMode.label}`}
        aria-expanded={open}
        title={`${activeMode.label} · ${activeAccent.label}`}
      >
        <span className="relative inline-flex">
          <NavIcon name={activeMode.icon} className="h-4 w-4" />
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-1 ring-[var(--app-surface)]"
            style={{ background: activeAccent.swatch }}
          />
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close theme menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-11 z-50 w-[11.5rem] rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-xl">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--app-muted)]">
              Accent
            </p>
            <div className="mb-3 grid grid-cols-5 gap-2">
              {ACCENT_OPTIONS.map((option) => {
                const active = accent === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAccent(option.value)}
                    className={`h-6 w-6 rounded-full transition ${
                      active
                        ? "ring-2 ring-[var(--app-text)] ring-offset-2 ring-offset-[var(--app-surface)]"
                        : "hover:scale-110"
                    }`}
                    style={{ background: option.swatch }}
                    aria-label={option.label}
                    title={option.label}
                  />
                );
              })}
            </div>

            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--app-muted)]">
              Mode
            </p>
            <div className="inline-flex w-full items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-1">
              {THEME_MODES.map((option) => {
                const active = mode === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMode(option.value)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-[var(--app-accent)] text-white shadow-sm"
                        : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
                    }`}
                    aria-label={option.label}
                    aria-pressed={active}
                    title={option.label}
                  >
                    <NavIcon name={option.icon} className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
