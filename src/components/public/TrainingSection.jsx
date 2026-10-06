import React from "react";
import { ArrowUpRight } from "lucide-react";
import { TRAINING_SERVICES } from "../../data/publicContent";
import FallbackImage from "./FallbackImage";

export default function TrainingSection() {
  return (
    <section id="training" className="section-offset bg-black py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Training</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl">
              TRAIN WITH PURPOSE
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/50">
            Five training tracks, one coaching standard — pick the style that
            fits your goal, or mix and match with your trainer's guidance.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRAINING_SERVICES.map((service) => (
            <div
              key={service.title}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10"
            >
              <FallbackImage
                src={service.image}
                alt={service.title}
                className="absolute inset-0 h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl tracking-wide text-white">{service.title}</h3>
                <p className="mt-2 max-h-0 overflow-hidden text-sm text-white/70 opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                  {service.desc}
                </p>
                <a
                  href="#contact"
                  className="section-offset mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ember"
                >
                  Learn More <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
