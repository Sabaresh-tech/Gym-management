import React from "react";
import { Check, Sparkles } from "lucide-react";
import { MEMBERSHIP_PLANS } from "../../data/mockData";

export default function MembershipSection({ onSelectPlan }) {
  return (
    <section id="membership" className="section-offset bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Membership</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl">
            PLANS FOR EVERY GOAL
          </h2>
          <p className="mt-4 text-white/55">
            Simple, transparent pricing. Every plan includes full gym floor
            access — upgrade whenever you're ready for more.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MEMBERSHIP_PLANS.map((plan) => {
            const featured = plan.name === "Premium";
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-transform hover:-translate-y-1 ${
                  featured
                    ? "border-ember bg-gradient-to-b from-ember/15 to-black shadow-[0_0_0_1px_rgba(255,75,34,0.5)]"
                    : "border-white/10 bg-black/40"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-ember px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    <Sparkles size={11} /> Most Popular
                  </span>
                )}

                <p className="font-display text-2xl tracking-wide text-white">{plan.name}</p>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-white">₹{plan.price.toLocaleString("en-IN")}</span>
                </p>
                <p className="text-xs uppercase tracking-wide text-white/40">{plan.duration}</p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/65">
                      <Check size={15} className="mt-0.5 shrink-0 text-ember" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onSelectPlan}
                  className={`mt-7 w-full rounded-full px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                    featured
                      ? "bg-ember text-white hover:bg-emberLight"
                      : "border border-white/15 text-white hover:border-ember hover:text-ember"
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-white/30">
          Plans shown reflect live membership data — sign in to manage or upgrade your own plan.
        </p>
      </div>
    </section>
  );
}
