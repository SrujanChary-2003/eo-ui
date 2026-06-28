import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const features = [
  {
    title: "Plan Any Event",
    description: "Weddings, birthdays, corporate events, and more — all in one platform.",
    icon: "🎉",
  },
  {
    title: "Book Trusted Vendors",
    description: "Discover verified vendors, compare services, and book with confidence.",
    icon: "✨",
  },
  {
    title: "Secure Payments",
    description: "End-to-end booking flow with secure payments and instant confirmations.",
    icon: "🔒",
  },
];

const eventTypes = [
  "Weddings",
  "Birthdays",
  "Engagements",
  "House Warming",
  "Corporate",
  "Religious",
  "Custom Events",
];

const steps = [
  { step: "01", title: "Create your event", desc: "Set date, location, and event type in minutes." },
  { step: "02", title: "Browse & book vendors", desc: "Search services, compare options, and send booking requests." },
  { step: "03", title: "Pay & celebrate", desc: "Confirm bookings, track everything, and enjoy your event." },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-24 pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            MVP Launch — Event Management Reimagined
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
            Plan unforgettable events with{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              EventSphere
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
            The all-in-one platform to organize events, discover vendors, manage bookings,
            and bring your celebrations to life — from intimate gatherings to grand affairs.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup">
              <Button className="px-8 py-3 text-base">Start planning free</Button>
            </Link>
            <Link to="/signin">
              <Button variant="secondary" className="px-8 py-3 text-base">
                Sign in to your account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="events" className="border-y border-white/5 bg-slate-900/50 px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-6 text-sm uppercase tracking-widest text-violet-400">Event types</p>
          <div className="flex flex-wrap justify-center gap-3">
            {eventTypes.map((type) => (
              <span
                key={type}
                className="rounded-full border border-white/10 bg-slate-800/50 px-5 py-2 text-sm text-slate-300"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Everything you need to orchestrate the perfect event
            </h2>
            <p className="text-slate-400">Built for customers, vendors, and admins from day one.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 transition hover:border-violet-500/30 hover:bg-slate-900"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-white/5 bg-slate-900/30 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-3xl font-bold text-white md:text-4xl">
            How EventSphere works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mb-4 text-5xl font-bold text-violet-500/30">{item.step}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-fuchsia-950/30 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to create your first event?</h2>
          <p className="mb-8 text-slate-400">
            Join EventSphere today. Sign up, verify your email, and start planning in minutes.
          </p>
          <Link to="/signup">
            <Button className="px-8 py-3 text-base">Create your account</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} EventSphere. All rights reserved.
      </footer>
    </>
  );
}
