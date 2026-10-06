import React from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Home, LogIn } from "lucide-react";

export default function LoggedOut() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-base px-4 text-center text-white">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ember text-white">
        <Dumbbell size={26} strokeWidth={2.5} />
      </span>

      <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">Logged Out Successfully</h1>
      <p className="mt-2 max-w-sm text-sm text-white/50">
        Thank you for visiting IronGrid Fitness's Gym Management System.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:flex-row">
        <button
          onClick={() => navigate("/", { replace: true })}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emberLight"
        >
          <Home size={16} /> Home
        </button>
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-ember hover:text-ember"
        >
          <LogIn size={16} /> Login Again
        </button>
      </div>
    </div>
  );
}
