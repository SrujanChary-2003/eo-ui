import { Link, Outlet } from "react-router-dom";
import { Card, CardContent, Typography } from "@onesaz/ui";
import { APP_NAME, APP_SHORT_NAME } from "../constants";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[var(--app-accent-soft)] blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-[var(--app-accent-soft)] blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--app-accent)] text-sm font-bold text-white">
              {APP_SHORT_NAME}
            </span>
            <Typography variant="h5" className="font-semibold text-[var(--app-text)]">
              {APP_NAME}
            </Typography>
          </Link>
        </div>
        <Card className="border-[var(--app-border)] bg-[var(--app-surface)] shadow-lg">
          <CardContent className="p-8">
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
