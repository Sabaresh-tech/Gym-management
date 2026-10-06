import React from "react";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { LOCATION_INFO } from "../../data/publicContent";

export default function LocationSection() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(LOCATION_INFO.mapQuery)}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(LOCATION_INFO.mapQuery)}`;

  return (
    <section id="location" className="section-offset bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Location</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl">
            FIND US ON THE FLOOR
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 p-5">
              <MapPin size={18} className="mt-0.5 shrink-0 text-ember" />
              <div>
                <p className="text-sm font-semibold text-white">Address</p>
                <p className="mt-1 text-sm text-white/50">
                  {LOCATION_INFO.addressLine1}
                  <br />
                  {LOCATION_INFO.addressLine2}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 p-5">
              <Phone size={18} className="mt-0.5 shrink-0 text-ember" />
              <div>
                <p className="text-sm font-semibold text-white">Phone</p>
                <p className="mt-1 text-sm text-white/50">{LOCATION_INFO.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 p-5">
              <Mail size={18} className="mt-0.5 shrink-0 text-ember" />
              <div>
                <p className="text-sm font-semibold text-white">Email</p>
                <p className="mt-1 text-sm text-white/50">{LOCATION_INFO.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 p-5">
              <Clock size={18} className="mt-0.5 shrink-0 text-ember" />
              <div>
                <p className="text-sm font-semibold text-white">Opening Hours</p>
                <div className="mt-1 space-y-0.5">
                  {LOCATION_INFO.hours.map((h) => (
                    <p key={h.day} className="text-sm text-white/50">
                      {h.day}: <span className="text-white/70">{h.time}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={directionsHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.02] hover:bg-emberLight"
            >
              <Navigation size={16} /> Get Directions
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 lg:col-span-3">
            <iframe
              title="Gym location map"
              src={mapSrc}
              className="h-[420px] w-full grayscale invert-[0.92] contrast-[1.05] lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
