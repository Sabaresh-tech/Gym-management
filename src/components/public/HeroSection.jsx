import React from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { STATS } from "../../data/publicContent";
import FallbackImage from "./FallbackImage";

export default function HeroSection({ onJoinClick }) {
  return (
    <section id="home" className="section-offset relative flex min-h-screen items-center overflow-hidden bg-black">
      <FallbackImage
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop"
        alt="Gym training floor"
        className="absolute inset-0 h-full w-full"
        imgClassName="h-full w-full object-cover object-center opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ember/40 bg-ember/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emberLight">
          Kalyan's Premium Training Floor
        </p>

        <h1 className="max-w-3xl font-display text-[15vw] leading-[0.95] tracking-wide text-white sm:text-[9vw] lg:text-[6.2vw]">
          YOUR FITNESS.
          <br />
          YOUR STRENGTH.
          <br />
          <span className="text-ember">YOUR SPACE.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base text-white/70 sm:text-lg">
          Train smarter. Get stronger. Become your best version — with expert
          coaching and a floor built for real results.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onJoinClick}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ember px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.03] hover:bg-emberLight"
          >
            Join Now <ArrowRight size={16} />
          </button>
          <a
            href="#membership"
            className="section-offset inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Explore Memberships
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-x-10">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl text-white sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About Us"
        className="section-offset absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-white/50 hover:text-white sm:block"
      >
        <ChevronDown size={26} />
      </a>
    </section>
  );
}
