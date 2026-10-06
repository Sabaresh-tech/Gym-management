import React from "react";
import { Search } from "lucide-react";

export function Field({ label, hint, error, children, id }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-xs font-medium text-white/50">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-white/35">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-alert">{error}</p>}
    </div>
  );
}

export function Input({ className = "", invalid = false, ...props }) {
  return (
    <input
      className={`w-full rounded-lg border bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-volt/50 focus:ring-1 focus:ring-volt/40 ${
        invalid ? "border-alert/50" : "border-white/10"
      } ${className}`}
      {...props}
    />
  );
}

export function SearchInput({ className = "", ...props }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
      <input
        type="text"
        className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white placeholder-white/35 outline-none focus:border-volt/50 focus:ring-1 focus:ring-volt/40"
        {...props}
      />
    </div>
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-volt/50 focus:ring-1 focus:ring-volt/40 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
