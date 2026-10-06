import React from "react";

// Central status -> style map so every page (members, payments, equipment,
// classes) reads the same visual language for "good/active" vs "bad/overdue".
const STYLES = {
  active: "bg-volt/15 text-volt ring-1 ring-inset ring-volt/30",
  good: "bg-volt/15 text-volt ring-1 ring-inset ring-volt/30",
  paid: "bg-volt/15 text-volt ring-1 ring-inset ring-volt/30",
  scheduled: "bg-volt/15 text-volt ring-1 ring-inset ring-volt/30",
  checked_in: "bg-volt/15 text-volt ring-1 ring-inset ring-volt/30",
  checked_out: "bg-white/10 text-white/60 ring-1 ring-inset ring-white/15",

  pending: "bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-400/30",
  needs_maintenance: "bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-400/30",

  suspended: "bg-alert/15 text-[#FF8A66] ring-1 ring-inset ring-alert/30",
  expired: "bg-alert/15 text-[#FF8A66] ring-1 ring-inset ring-alert/30",
  overdue: "bg-alert/15 text-[#FF8A66] ring-1 ring-inset ring-alert/30",
  damaged: "bg-alert/15 text-[#FF8A66] ring-1 ring-inset ring-alert/30",
  cancelled: "bg-alert/15 text-[#FF8A66] ring-1 ring-inset ring-alert/30",
  full: "bg-alert/15 text-[#FF8A66] ring-1 ring-inset ring-alert/30",

  frozen: "bg-white/10 text-white/50 ring-1 ring-inset ring-white/15",
  under_maintenance: "bg-white/10 text-white/50 ring-1 ring-inset ring-white/15",
};

export default function Badge({ status, children }) {
  const style = STYLES[status] || "bg-white/10 text-white/60 ring-1 ring-inset ring-white/15";
  const label = children ?? status?.replace(/_/g, " ");
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}
