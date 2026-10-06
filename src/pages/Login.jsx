import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Dumbbell, Mail, Lock, Eye, EyeOff, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Field, Input } from "../components/FormControls";
import Button from "../components/Button";
import { BRANCH } from "../data/mockData";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectFor = (role) => {
    const from = location.state?.from;
    if (from && from !== "/login") return from;
    if (role === "member") return "/portal";
    if (role === "trainer") return "/trainer";
    return "/dashboard";
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    // login() now calls the backend (POST /api/users/login) and returns a
    // JWT on success — see AuthContext.jsx.
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(redirectFor(result.user.role), { replace: true });
  }


  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-base text-white lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-white/10 bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full border-[16px] border-white/[0.03]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-volt/10 blur-3xl"
        />

        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-volt text-black">
            <Dumbbell size={20} strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-2xl tracking-wide" style={{ letterSpacing: "0.04em" }}>
              IRONGRID
            </p>
            <p className="text-[11px] uppercase tracking-wide text-white/35">{BRANCH.location}</p>
          </div>
        </div>

        <div className="relative">
          <p className="font-display text-5xl leading-[1.05] tracking-wide text-white xl:text-6xl">
            RUN THE FLOOR.
            <br />
            <span className="text-volt">NOT AROUND IT.</span>
          </p>
          <p className="mt-5 max-w-md text-sm text-white/45">
            One dashboard for admins, staff and members — each signed in
            to the view built for their job.
          </p>
        </div>

        <p className="relative font-mono text-xs text-white/30">
          © {new Date().getFullYear()} IronGrid Fitness. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <Link
          to="/"
          className="absolute left-4 top-4 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 sm:left-6 sm:top-6"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-volt text-black">
              <Dumbbell size={18} strokeWidth={2.5} />
            </span>
            <p className="font-display text-xl tracking-wide" style={{ letterSpacing: "0.04em" }}>
              IRONGRID
            </p>
          </div>

          <h1 className="text-2xl font-semibold text-white">Sign in</h1>
          <p className="mt-1.5 text-sm text-white/45">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Field label="Email" id="email">
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@irongrid.gym"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </Field>

            <Field label="Password" id="password">
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9 pr-9"
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

            {error && (
              <p role="alert" className="rounded-lg bg-alert/10 px-3 py-2 text-xs text-[#FF8A66]">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading} icon={loading ? undefined : ArrowRight}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-8 text-center text-[11px] text-white/30">
            Sign in with the credentials issued by your gym.
          </p>
        </div>
      </div>
    </div>
  );
}
