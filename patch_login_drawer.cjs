const fs = require('fs');
const path = './src/components/public/LoginDrawer.jsx';
let content = fs.readFileSync(path, 'utf8');

// We will replace the entire file with the updated React component.
// But first let's build the React component in memory and write it.

const updated = `import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, X, Mail, Lock, Eye, EyeOff, ArrowRight, User as UserIcon, Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Field, Input } from "../FormControls";
import { authApi } from "../../services/api";

export default function LoginDrawer({ isOpen, onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState("login"); // "login" | "register"
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  
  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regRole, setRegRole] = useState("staff");
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ESC closes the drawer.
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset transient state whenever the drawer closes.
  useEffect(() => {
    if (!isOpen) {
      setError("");
      setSuccess("");
      setLoading(false);
      setShowPassword(false);
      setShowRegPassword(false);
      setMode("login");
    }
  }, [isOpen]);

  function redirectFor(role) {
    return role === "member" ? "/portal" : "/dashboard";
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    login(email, password).then((result) => {
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onClose();
      navigate(redirectFor(result.user.role), { replace: true });
    });
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!regName.trim() || !regEmail.trim() || !regPassword || !regConfirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (regPassword !== regConfirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
      });
      setLoading(false);
      setMode("login");
      setSuccess("Registration successful! Please login.");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirm("");
      setRegRole("staff");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Registration failed");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={mode === "login" ? "Login" : "Register"}
        className="animate-drawer-in absolute right-0 top-0 flex h-full w-full max-w-full flex-col overflow-y-auto border-l border-white/10 bg-surface p-6 shadow-2xl sm:max-w-[440px] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-white">
              <Dumbbell size={17} strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl tracking-wide text-white" style={{ letterSpacing: "0.04em" }}>
              IRONGRID
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {mode === "login" ? (
          <>
            <div className="mt-9">
              <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
              <p className="mt-1.5 text-sm text-white/45">Login to your account</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="mt-7 space-y-4" noValidate>
              <Field label="Email" id="drawer-email">
                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <Input
                    id="drawer-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@irongrid.gym"
                    className="pl-9 focus:border-ember/50 focus:ring-ember/40"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Password" id="drawer-password">
                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <Input
                    id="drawer-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pl-9 pr-9 focus:border-ember/50 focus:ring-ember/40"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/50">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-ember"
                  />
                  Remember me
                </label>
                <button type="button" className="text-white/50 hover:text-ember">
                  Forgot password?
                </button>
              </div>

              {error && (
                <p role="alert" className="rounded-lg bg-alert/10 px-3 py-2 text-xs text-[#FF8A66]">
                  {error}
                </p>
              )}
              {success && (
                <p role="alert" className="rounded-lg bg-volt/10 px-3 py-2 text-xs text-volt">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emberLight disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in…" : "Login"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-white/35">
              Don't have an account?{" "}
              <button type="button" onClick={() => { setMode("register"); setError(""); setSuccess(""); }} className="text-ember hover:text-emberLight">
                Register
              </button>
            </p>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[11px] text-white/35">
              Demo build — the member portal works out of the box with{" "}
              <span className="text-white/55">aarav.mehta@mail.com / member123</span>. Admin and
              staff sign in with a real account registered via the API.
            </div>
          </>
        ) : (
          <>
            <div className="mt-9">
              <button 
                type="button" 
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className="mb-4 flex items-center gap-1.5 text-xs text-white/50 hover:text-white"
              >
                <ArrowLeft size={14} /> Back to Login
              </button>
              <h2 className="text-2xl font-semibold text-white">Register</h2>
              <p className="mt-1.5 text-sm text-white/45">Create a new system user</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="mt-7 space-y-4" noValidate>
              <Field label="Full Name" id="reg-name">
                <div className="relative">
                  <UserIcon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Jane Doe"
                    className="pl-9 focus:border-ember/50 focus:ring-ember/40"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
              </Field>
              
              <Field label="Email" id="reg-email">
                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@irongrid.gym"
                    className="pl-9 focus:border-ember/50 focus:ring-ember/40"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Role" id="reg-role">
                <div className="relative">
                  <Shield size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <select
                    id="reg-role"
                    className="w-full appearance-none rounded-lg border border-white/10 bg-black/20 pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:border-ember/50 focus:outline-none focus:ring-1 focus:ring-ember/40"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </Field>

              <Field label="Password" id="reg-password">
                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <Input
                    id="reg-password"
                    type={showRegPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="pl-9 pr-9 focus:border-ember/50 focus:ring-ember/40"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((s) => !s)}
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70"
                  >
                    {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>

              <Field label="Confirm Password" id="reg-confirm">
                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                  <Input
                    id="reg-confirm"
                    type={showRegPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="pl-9 focus:border-ember/50 focus:ring-ember/40"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                  />
                </div>
              </Field>

              {error && (
                <p role="alert" className="rounded-lg bg-alert/10 px-3 py-2 text-xs text-[#FF8A66]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emberLight disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Registering…" : "Register"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
`;
fs.writeFileSync(path, updated);
