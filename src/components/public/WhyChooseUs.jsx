import React from "react";
import { BadgeCheck, Dumbbell, Target, CalendarClock, TrendingUp, Users2 } from "lucide-react";
import { WHY_CHOOSE_US } from "../../data/publicContent";

const ICONS = [BadgeCheck, Dumbbell, Target, CalendarClock, TrendingUp, Users2];

export default function WhyChooseUs() {
  return (
    <section className="bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Why Choose Us</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl">
            EVERYTHING YOU NEED TO PROGRESS
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/40 p-6 transition-colors hover:border-ember/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember/15 text-ember">
                  <Icon size={20} />
                </span>
                <p className="mt-4 text-base font-semibold text-white">{item.title}</p>
                <p className="mt-1.5 text-sm text-white/45">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
