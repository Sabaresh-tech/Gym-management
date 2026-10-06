import React from "react";
import { ArrowRight } from "lucide-react";
import FallbackImage from "./FallbackImage";

export default function CommunitySection({ onJoinClick }) {
  return (
    <section className="relative overflow-hidden bg-black py-28 sm:py-36">
      <FallbackImage
        src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2000&auto=format&fit=crop"
        alt="Gym community training together"
        className="absolute inset-0 h-full w-full"
        imgClassName="h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/60" />

      <div className="relative mx-auto max-w-[1440px] px-4 text-center sm:px-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Community</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-6xl">
          MORE THAN A GYM
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/65">
          A place to train, grow, connect and build a healthier lifestyle —
          alongside people who show up for the same reasons you do.
        </p>
        <button
          onClick={onJoinClick}
          className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-ember px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.03] hover:bg-emberLight"
        >
          Join the Community <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
