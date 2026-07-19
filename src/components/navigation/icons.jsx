import {
  LayoutDashboard,
  CalendarDays,
  Store,
  BriefcaseBusiness,
  ConciergeBell,
  ClipboardList,
  Users,
  Settings,
  ShieldCheck,
  BadgeCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export const ICONS = {
  overview: LayoutDashboard,
  events: CalendarDays,
  vendors: Store,
  profile: BriefcaseBusiness,
  services: ConciergeBell,
  bookings: ClipboardList,
  users: Users,
  settings: Settings,
  approveEvents: ShieldCheck,
  approveVendors: BadgeCheck,
  sidebarClose: PanelLeftClose,
  sidebarOpen: PanelLeftOpen,
  search: Search,
  bell: Bell,
  sun: Sun,
  moon: Moon,
  system: Monitor,
  logout: LogOut,
  sparkles: Sparkles,
  chevronDown: ChevronDown,
};

export function NavIcon({ name, className = "h-4 w-4" }) {
  const Icon = ICONS[name] || LayoutDashboard;
  return <Icon className={className} strokeWidth={1.9} />;
}
