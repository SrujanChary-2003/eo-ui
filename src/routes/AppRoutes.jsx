import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LandingPage from "../pages/LandingPage";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import PendingVerificationPage from "../pages/auth/PendingVerificationPage";
import DashboardPage from "../pages/DashboardPage";
import EventsPage from "../pages/events/EventsPage";
import CreateEventPage from "../pages/events/CreateEventPage";
import EventDetailPage from "../pages/events/EventDetailPage";
import VendorsBrowsePage from "../pages/vendors/VendorsBrowsePage";
import VendorDetailPage from "../pages/vendors/VendorDetailPage";
import VendorProfilePage from "../pages/vendor/VendorProfilePage";
import VendorServicesPage from "../pages/vendor/VendorServicesPage";
import VendorBookingsPage from "../pages/vendor/VendorBookingsPage";
import AdminEventsPage from "../pages/admin/AdminEventsPage";
import AdminVendorsPage from "../pages/admin/AdminVendorsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />

          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="signin" element={<SignInPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="verify-email" element={<VerifyEmailPage />} />
              <Route path="pending-verification" element={<PendingVerificationPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />

            <Route element={<RoleRoute roles={["customer"]} />}>
              <Route path="events" element={<EventsPage />} />
              <Route path="events/new" element={<CreateEventPage />} />
              <Route path="events/:eventId" element={<EventDetailPage />} />
              <Route path="vendors" element={<VendorsBrowsePage />} />
              <Route path="vendors/:vendorId" element={<VendorDetailPage />} />
            </Route>

            <Route element={<RoleRoute roles={["vendor"]} />}>
              <Route path="vendor/profile" element={<VendorProfilePage />} />
              <Route path="vendor/services" element={<VendorServicesPage />} />
              <Route path="vendor/bookings" element={<VendorBookingsPage />} />
            </Route>

            <Route element={<RoleRoute roles={["admin"]} />}>
              <Route path="admin/events" element={<AdminEventsPage />} />
              <Route path="admin/vendors" element={<AdminVendorsPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
