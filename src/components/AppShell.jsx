import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const TITLES = {
  "/dashboard": "Dashboard",
  "/members": "Members",
  "/memberships": "Memberships",
  "/trainers": "Trainers",
  "/attendance": "Attendance",
  "/payments": "Payments",
  "/classes": "Classes",
  "/equipment": "Equipment",
  "/reports": "Reports",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "IronGrid";

  return (
    <div className="min-h-screen w-full bg-base text-white">
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-base lg:block">
          <Sidebar />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setDrawerOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-base">
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </div>
        )}

        <div className="min-h-screen flex-1">
          <Navbar title={title} onMenuClick={() => setDrawerOpen(true)} />
          <main className="space-y-6 px-4 py-6 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
