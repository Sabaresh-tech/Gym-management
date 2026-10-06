import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, getToken, setToken } from "../services/api";

// createContext + a Provider component is the standard useContext pattern:
// AuthProvider owns the actual state, and anything wrapped inside it can
// read/update that state via the useAuth() custom hook below — no prop
// drilling required, no matter how deeply a component is nested.
const AuthContext = createContext(null);
const STORAGE_KEY = "irongrid_session";

function strip(user) {
  const { password, ...safe } = user;
  return safe;
}

// The backend only returns { _id, name, email, role, ... } — no
// `initials`/`title` the way the old DEMO_USERS objects did. Derive them
// here so Navbar/Sidebar (which already read user.initials/user.title)
// keep working without any changes to those components.
function enrichUser(user) {
  if (!user) return user;
  const initials = (user.name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  const title = user.role === "admin" ? "Admin" : user.role === "staff" ? "Staff" : user.role === "member" ? "Member" : user.role === "trainer" ? "Trainer" : user.title;
  return { ...user, initials: user.initials || initials || "?", title: user.title || title };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(true);

  // Keep localStorage in sync with `user` automatically: it re-runs only
  // when `user` changes (see the dependency array), so login, logout, and
  // role-switching all persist without any extra code at the call sites —
  // they just call setUser and this effect handles the rest.
  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage unavailable — session simply won't persist across reloads
    }
  }, [user]);

  // On first load, if a JWT is already stored (from a previous admin/staff
  // login), confirm it's still valid against the backend via GET /me
  // rather than trusting the cached `user` blindly forever.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(enrichUser(res.data)))
      .catch(() => {
        // Expired/invalid token — clear everything and fall back to
        // logged-out state.
        setToken(null);
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
    // Only ever run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real JWT login for the owner/front-desk (admin/staff) workspace —
  // POST /api/users/login (Experiment 6). Returns the same { ok, user } /
  // { ok, error } shape the rest of the app (Login.jsx) already expects.
  async function login(email, password) {
    try {
      const res = await authApi.login({ email, password });
      setToken(res.token);
      const user = enrichUser(res.data);
      setUser(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: err.message || "Invalid email or password." };
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, authLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook: wraps useContext(AuthContext) so every component just calls
// useAuth() instead of importing useContext + AuthContext everywhere, and
// fails loudly if it's ever used outside an <AuthProvider>.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
