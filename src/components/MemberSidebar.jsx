import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard as MembershipIcon,
  CalendarDays,
  Wallet,
  ClipboardCheck,
  Bell,
  UserCircle2,
  Dumbbell,
  LogOut,
  Home,
  X,
} from "lucide-react";
import { BRANCH, MEMBERS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/portal/membership", label: "My Membership", icon: MembershipIcon },
  { to: "/portal/classes", label: "Classes", icon: CalendarDays },
  { to: "/portal/payments", label: "Payments", icon: Wallet },
  { to: "/portal/attendance", label: "My Visits", icon: ClipboardCheck },
  { to: "/portal/notifications", label: "Notifications", icon: Bell },
  { to: "/portal/profile", label: "Profile", icon: UserCircle2 },
];

export default function MemberSidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const me = MEMBERS.find((m) => m.id === user?.memberId);

  function handleLogout() {
    logout();
    navigate("/logged-out", { replace: true });
  }

  // Navigates to the public site WITHOUT clearing the session.
  function handleGoHome() {
    navigate("/");
  }

  const daysLeft = me
    ? Math.max(0, Math.ceil((new Date(me.expiry) - new Date("2026-08-15")) / (1000 * 60 * 60 * 24)))
    : null;

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
        {NAV_ITEMS.map((item) => {
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

      {me && (
        <div className="mx-3 mb-3 mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/40">{me.plan} plan</p>
          <p className="mt-1 font-mono text-2xl text-volt">{daysLeft}d left</p>
          <p className="mt-1 text-[11px] text-white/35">Renews {me.expiry}</p>
        </div>
      )}

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
