import React from "react";
import { Apple, HeartPulse, Moon, Scale } from "lucide-react";
import { NUTRITION_POINTS } from "../../data/publicContent";
import FallbackImage from "./FallbackImage";

const ICONS = [Apple, HeartPulse, Moon, Scale];

export default function NutritionSection() {
  return (
    <section id="nutrition" className="section-offset bg-black py-24 sm:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Health &amp; Nutrition</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl">
            TRAINING IS HALF THE STORY
          </h2>
          <p className="mt-5 max-w-lg text-white/60">
            Results come from what happens outside the gym too. Our coaches
            pair every training plan with practical nutrition and recovery
            guidance — no fad diets, just sustainable habits.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {NUTRITION_POINTS.map((point, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={point.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/15 text-ember">
                    <Icon size={18} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-white">{point.title}</p>
                  <p className="mt-1 text-xs text-white/45">{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <FallbackImage
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop"
          alt="Healthy meal preparation"
          className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10"
          imgClassName="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
