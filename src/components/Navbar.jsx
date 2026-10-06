import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut, Home } from "lucide-react";
import { NOTIFICATIONS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ title, onMenuClick, showSearch = true }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/logged-out", { replace: true });
  }

  // Navigates to the public site WITHOUT clearing the session.
  function handleGoHome() {
    navigate("/");
    setProfileOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-base/90 px-4 py-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/5 lg:hidden"
      >
        <Menu size={19} />
      </button>

      <h1 className="hidden shrink-0 font-display text-2xl tracking-wide text-white sm:block" style={{ letterSpacing: "0.02em" }}>
        {title}
      </h1>

      {showSearch && (
        <div className="relative ml-auto max-w-xs flex-1 sm:ml-6">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="text"
            placeholder="Search members, classes…"
            aria-label="Global search"
            className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white placeholder-white/35 outline-none focus:border-volt/50 focus:ring-1 focus:ring-volt/40"
          />
        </div>
      )}

      <div className={`relative ${showSearch ? "" : "ml-auto"}`}>
        <button
          onClick={() => {
            setNotifOpen((o) => !o);
            setProfileOpen(false);
          }}
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/5"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-alert" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-surface2 p-2 shadow-xl">
            <p className="px-2 py-1.5 text-xs uppercase tracking-wide text-white/40">Notifications</p>
            <div className="max-h-72 overflow-y-auto no-scrollbar">
              {NOTIFICATIONS.slice(0, 4).map((n) => (
                <div key={n.id} className="rounded-lg px-2 py-2 hover:bg-white/5">
                  <p className="text-sm text-white/85">{n.title}</p>
                  <p className="text-xs text-white/40">{n.detail}</p>
                  <p className="mt-0.5 text-[10px] text-white/30">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => {
            setProfileOpen((o) => !o);
            setNotifOpen(false);
          }}
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-white/5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-volt text-xs font-semibold text-black">
            {user?.initials ?? "?"}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-medium text-white">{user?.name ?? "Guest"}</span>
            <span className="block text-xs text-white/40">{user?.title ?? ""}</span>
          </span>
          <ChevronDown size={14} className="hidden text-white/40 sm:block" />
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-surface2 p-1.5 shadow-xl">
            <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white">
              <User size={15} /> Profile
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white">
              <Settings size={15} /> Settings
            </button>
            <button
              onClick={handleGoHome}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              <Home size={15} /> Home
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-[#FF8A66] hover:bg-alert/10"
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
