import React from "react";
import { Clock, Users2 } from "lucide-react";
import { CLASS_SCHEDULE } from "../../data/publicContent";
import FallbackImage from "./FallbackImage";

export default function ClassesSection({ onViewAll }) {
  return (
    <section id="classes" className="section-offset bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Classes</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl">
            GROUP CLASSES THAT PUSH YOU
          </h2>
          <p className="mt-4 text-white/55">
            Coach-led sessions for every energy level — book your spot from
            your member portal once you're signed in.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CLASS_SCHEDULE.map((cls) => (
            <div
              key={cls.name}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition-transform hover:-translate-y-1"
            >
              <FallbackImage
                src={cls.image}
                alt={cls.name}
                className="h-44 w-full"
                imgClassName="h-full w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-display text-xl tracking-wide text-white">{cls.name}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-white/50">
                  <Clock size={13} /> {cls.time}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                  <Users2 size={13} /> {cls.level}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center justify-center rounded-full bg-ember px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.03] hover:bg-emberLight"
          >
            View All Classes
          </button>
        </div>
      </div>
    </section>
  );
}
