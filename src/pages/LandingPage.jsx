import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import {
  APP_NAME,
  APP_TAGLINE,
  EVENT_TYPE_CHIPS,
  LANDING_FEATURES,
  LANDING_STEPS,
} from "../constants";

const sectionPad = "px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12";

export default function LandingPage() {
  return (
    <>
      <section className={`relative overflow-hidden ${sectionPad} pb-14 pt-12 sm:pb-20 sm:pt-16 md:pt-24`}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[320px] w-[90vw] max-w-[720px] -translate-x-1/2 rounded-full bg-[var(--app-accent-soft)] blur-3xl sm:h-[420px]" />
        </div>
        <div className="relative mx-auto w-full max-w-4xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--app-accent-text)] sm:mb-5 sm:text-sm">
            {APP_NAME}
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-[var(--app-text)] sm:mb-5 sm:text-4xl md:text-6xl">
            Plan unforgettable events
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm text-[var(--app-muted)] sm:mb-10 sm:text-base md:text-lg">
            {APP_TAGLINE} Create events, discover vendors, and manage bookings in one calm workspace.
          </p>
          <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full px-8 py-3 text-base sm:w-auto">Start planning</Button>
            </Link>
            <Link to="/signin" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full px-8 py-3 text-base sm:w-auto">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className={`border-y border-[var(--app-border)] ${sectionPad} py-12`}>
        <div className="mx-auto flex w-full max-w-5xl flex-wrap justify-center gap-2.5">
          {EVENT_TYPE_CHIPS.map((type) => (
            <span
              key={type}
              className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-1.5 text-sm text-[var(--app-text-secondary)]"
            >
              {type}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className={`${sectionPad} py-20`}>
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-[var(--app-text)]">Built for clear planning</h2>
            <p className="text-[var(--app-muted)]">Everything customers, vendors, and admins need — without clutter.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {LANDING_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-7 transition hover:border-[var(--app-accent)]/30"
              >
                <h3 className="mb-2 text-lg font-semibold text-[var(--app-text)]">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--app-muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`border-t border-[var(--app-border)] ${sectionPad} py-20`}>
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--app-text)]">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {LANDING_STEPS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-3 text-4xl font-bold text-[var(--app-accent-soft)]">{item.step}</div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--app-text)]">{item.title}</h3>
                <p className="text-sm text-[var(--app-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionPad} pb-20 pt-8`}>
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] px-8 py-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[var(--app-text)] md:text-3xl">
            Ready for your next event?
          </h2>
          <p className="mb-8 text-[var(--app-muted)]">
            Create an account, verify your email, and start planning in minutes.
          </p>
          <Link to="/signup">
            <Button className="px-8 py-3 text-base">Create account</Button>
          </Link>
        </div>
      </section>

      <footer className={`border-t border-[var(--app-border)] ${sectionPad} py-8 text-center text-sm text-[var(--app-faint)]`}>
        © {new Date().getFullYear()} {APP_NAME}
      </footer>
    </>
  );
}
