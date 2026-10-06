import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MemberSidebar from "./MemberSidebar";
import Navbar from "./Navbar";

const TITLES = {
  "/portal": "My Dashboard",
  "/portal/membership": "My Membership",
  "/portal/classes": "Classes",
  "/portal/payments": "Payments",
  "/portal/attendance": "My Visits",
  "/portal/notifications": "Notifications",
  "/portal/profile": "Profile",
};

export default function MemberShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "IronGrid";

  return (
    <div className="min-h-screen w-full bg-base text-white">
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-base lg:block">
          <MemberSidebar />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setDrawerOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-base">
              <MemberSidebar onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </div>
        )}

        <div className="min-h-screen flex-1">
          <Navbar title={title} onMenuClick={() => setDrawerOpen(true)} showSearch={false} />
          <main className="space-y-6 px-4 py-6 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
