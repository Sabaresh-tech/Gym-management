import React from "react";
import { CheckCircle2 } from "lucide-react";
import { HIGHLIGHTS } from "../../data/publicContent";
import FallbackImage from "./FallbackImage";

export default function AboutSection() {
  return (
    <section id="about" className="section-offset bg-black py-24 sm:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className="relative order-2 lg:order-1">
          <FallbackImage
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200&auto=format&fit=crop"
            alt="Modern gym training environment"
            className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10"
            imgClassName="h-full w-full object-cover"
          />
          <div className="absolute -bottom-6 -right-4 hidden max-w-[220px] rounded-2xl border border-white/10 bg-surface p-5 shadow-2xl sm:block">
            <p className="font-display text-3xl text-ember">10+</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/50">
              Years shaping stronger, healthier members
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">About Us</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl">
            BUILT FOR PEOPLE WHO SHOW UP
          </h2>
          <p className="mt-5 text-white/60">
            IronGrid Fitness is a training floor built around real coaching,
            not just equipment. We started with a simple idea: give people in
            Kalyan a gym that takes their goals as seriously as they do.
          </p>
          <p className="mt-4 text-white/60">
            Our <span className="text-white">mission</span> is to make expert
            training accessible and consistent. Our <span className="text-white">vision</span> is
            a community that keeps each other accountable long after the
            first workout. Whether you're chasing your first pull-up or your
            tenth year of training, this floor is built for you.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-ember" />
                <div>
                  <p className="text-sm font-semibold text-white">{h.title}</p>
                  <p className="mt-0.5 text-xs text-white/45">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="section-offset mt-8 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-ember hover:text-ember"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
