import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LiveChat from "./components/LiveChat";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import LoggedOut from "./pages/LoggedOut";

import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Memberships from "./pages/Memberships";
import Trainers from "./pages/Trainers";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import Classes from "./pages/Classes";
import Equipment from "./pages/Equipment";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

import MemberShell from "./components/MemberShell";
import MemberDashboard from "./pages/member/MemberDashboard";
import MyMembership from "./pages/member/MyMembership";
import BookClasses from "./pages/member/BookClasses";
import MyPayments from "./pages/member/MyPayments";
import MyAttendance from "./pages/member/MyAttendance";
import MyProfile from "./pages/member/MyProfile";

import TrainerDashboard from "./pages/trainer/TrainerDashboard";

// Wildcard fallback: sends unauthenticated visitors to the public landing
// page instead of the old plain login page, and sends already-authenticated
// users to the dashboard built for their role.
function NotFoundRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === "member") return <Navigate to="/portal" replace />;
  if (user.role === "trainer") return <Navigate to="/trainer" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logged-out" element={<LoggedOut />} />

            {/* Admin + Staff workspace (Experiment 6: JWT-authenticated) */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/memberships" element={<Memberships />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/notifications" element={<Notifications />} />

                {/* Admin-only pages */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route path="/trainers" element={<Trainers />} />
                  <Route path="/equipment" element={<Equipment />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
            </Route>

            {/* Member portal */}
            <Route element={<ProtectedRoute allowedRoles={["member"]} />}>
              <Route element={<MemberShell />}>
                <Route path="/portal" element={<MemberDashboard />} />
                <Route path="/portal/membership" element={<MyMembership />} />
                <Route path="/portal/classes" element={<BookClasses />} />
                <Route path="/portal/payments" element={<MyPayments />} />
                <Route path="/portal/attendance" element={<MyAttendance />} />
                <Route path="/portal/notifications" element={<Notifications />} />
                <Route path="/portal/profile" element={<MyProfile />} />
              </Route>
            </Route>

            {/* Trainer portal */}
            <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
              <Route path="/trainer" element={<TrainerDashboard />} />
            </Route>

            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
          <LiveChat />
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
