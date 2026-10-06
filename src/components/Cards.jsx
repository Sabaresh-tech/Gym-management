import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({ icon: Icon, label, value, delta, up, description }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border-[10px] border-white/[0.04]"
      />
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-volt">
          <Icon size={16} strokeWidth={2.25} />
        </span>
        {delta && (
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${up ? "text-volt" : "text-[#FF8A66]"}`}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 font-mono text-3xl text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/40">{label}</p>
      {description && <p className="mt-2 text-xs text-white/35">{description}</p>}
    </div>
  );
}

export function ChartCard({ title, actions, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-surface p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">{title}</h2>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function TabGroup({ options, active, onChange }) {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-0.5 text-xs">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-full px-3 py-1.5 transition-colors ${
            active === opt.id ? "bg-volt text-black font-medium" : "text-white/50 hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
