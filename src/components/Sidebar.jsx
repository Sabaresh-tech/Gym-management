import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard as MembershipIcon,
  Dumbbell,
  ClipboardCheck,
  Wallet,
  CalendarDays,
  Wrench,
  FileBarChart,
  Bell,
  Settings,
  LogOut,
  Home,
  X,
} from "lucide-react";
import { BRANCH } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true, roles: ["admin", "staff"] },
  { to: "/members", label: "Members", icon: Users, roles: ["admin", "staff"] },
  { to: "/memberships", label: "Memberships", icon: MembershipIcon, roles: ["admin", "staff"] },
  { to: "/trainers", label: "Trainers", icon: Dumbbell, roles: ["admin"] },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck, roles: ["admin", "staff"] },
  { to: "/payments", label: "Payments", icon: Wallet, roles: ["admin", "staff"] },
  { to: "/classes", label: "Classes", icon: CalendarDays, roles: ["admin", "staff"] },
  { to: "/equipment", label: "Equipment", icon: Wrench, roles: ["admin"] },
  { to: "/reports", label: "Reports", icon: FileBarChart, roles: ["admin"] },
  { to: "/notifications", label: "Notifications", icon: Bell, roles: ["admin", "staff"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["admin"] },
];

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role ?? "staff";
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  function handleLogout() {
    logout();
    navigate("/logged-out", { replace: true });
  }

  // Navigates to the public site WITHOUT clearing the session — the person
  // stays signed in and can come back to their dashboard from the navbar.
  function handleGoHome() {
    navigate("/");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-volt text-black">
            <Dumbbell size={18} strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-xl tracking-wide text-white" style={{ letterSpacing: "0.04em" }}>
              IRONGRID
            </p>
            <p className="text-[10px] uppercase tracking-wide text-white/35">{BRANCH.location}</p>
          </div>
        </div>
        <button
          onClick={onNavigate}
          aria-label="Close menu"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/5 lg:hidden"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-volt text-black font-medium" : "text-white/55 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={17} strokeWidth={2.25} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-white/40">Today's check-ins</p>
        <p className="mt-1 font-mono text-2xl text-volt">212 / 260</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[81%] rounded-full bg-volt" />
        </div>
      </div>

      <button
        onClick={handleGoHome}
        className="mx-3 mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 hover:bg-white/5 hover:text-white"
      >
        <Home size={17} strokeWidth={2.25} />
        Home
      </button>

      <button
        onClick={handleLogout}
        className="mx-3 mb-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 hover:bg-white/5 hover:text-white"
      >
        <LogOut size={17} strokeWidth={2.25} />
        Log out
      </button>
    </div>
  );
}
