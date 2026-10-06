import React from "react";

const VARIANTS = {
  primary: "bg-volt text-black hover:brightness-95",
  secondary: "bg-white/[0.06] text-white border border-white/10 hover:bg-white/10",
  ghost: "text-white/60 hover:bg-white/5 hover:text-white",
  danger: "bg-alert/15 text-[#FF8A66] border border-alert/30 hover:bg-alert/25",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {children}
    </button>
  );
}
