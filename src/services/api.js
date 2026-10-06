// Thin fetch wrapper for the Experiment 4 REST API (backend/), extended in
// Experiment 6 to attach a JWT automatically and expose the auth endpoints.
//
// Configure the backend URL via a Vite env var (defaults to localhost:5000
// for local development, matching backend/.env.example's PORT).

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "token";

// --- Token helpers ---------------------------------------------------------
// Centralized here so every component that needs the token (or needs to
// clear it on logout) goes through one place instead of touching
// localStorage directly all over the app.
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage unavailable — auth simply won't persist across reloads
  }
}

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response (e.g. network-level failure); body stays null.
  }

  if (!res.ok) {
    const message = body?.message || `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return body;
}

// --- Auth (Experiment 6) ----------------------------------------------------
export const authApi = {
  register: (data) => request("/users/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/users/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/users/me"),
};

// --- Members -------------------------------------------------------------
export const membersApi = {
  list: () => request("/members"),
  get: (id) => request(`/members/${id}`),
  create: (data) => request("/members", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/members/${id}`, { method: "DELETE" }),
};

// --- Memberships -----------------------------------------------------------
export const membershipsApi = {
  list: () => request("/memberships"),
  get: (id) => request(`/memberships/${id}`),
  create: (data) => request("/memberships", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/memberships/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/memberships/${id}`, { method: "DELETE" }),
};

// --- Trainers --------------------------------------------------------------
export const trainersApi = {
  list: () => request("/trainers"),
  get: (id) => request(`/trainers/${id}`),
  create: (data) => request("/trainers", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/trainers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/trainers/${id}`, { method: "DELETE" }),
};

// --- Attendance ------------------------------------------------------------
export const attendanceApi = {
  list: () => request("/attendance"),
  get: (id) => request(`/attendance/${id}`),
  create: (data) => request("/attendance", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/attendance/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/attendance/${id}`, { method: "DELETE" }),
};

export const healthApi = {
  check: () => request("/health"),
};
