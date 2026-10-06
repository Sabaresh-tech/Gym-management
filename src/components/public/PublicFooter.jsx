import React from "react";
import { Dumbbell, MapPin, Phone, Mail, Share2 } from "lucide-react";
import { LOCATION_INFO } from "../../data/publicContent";

const COLUMNS = [
  {
    heading: "Gym",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Membership", href: "#membership" },
      { label: "Training", href: "#training" },
      { label: "Classes", href: "#classes" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Personal Training", href: "#training" },
      { label: "Fitness Assessment", href: "#nutrition" },
      { label: "Nutrition", href: "#nutrition" },
      { label: "Recovery", href: "#nutrition" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#contact" },
      { label: "Terms & Conditions", href: "#contact" },
      { label: "Privacy Policy", href: "#contact" },
    ],
  },
];

export default function PublicFooter({ onLoginClick, onJoinClick }) {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-white">
                <Dumbbell size={18} strokeWidth={2.5} />
              </span>
              <span className="font-display text-xl tracking-wide text-white" style={{ letterSpacing: "0.04em" }}>
                IRONGRID
              </span>
            </a>
            <p className="mt-4 text-sm text-white/40">
              A premium training floor for people who take their fitness
              seriously.
            </p>
            <div className="mt-5 flex gap-2">
              {["Instagram", "Facebook", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#contact"
                  aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-ember hover:text-ember"
                >
                  <Share2 size={14} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="section-offset text-sm text-white/55 hover:text-ember">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Get Started</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <button onClick={onLoginClick} className="text-sm text-white/55 hover:text-ember">
                  Login
                </button>
              </li>
              <li>
                <button onClick={onJoinClick} className="text-sm text-white/55 hover:text-ember">
                  Join Now
                </button>
              </li>
              <li>
                <a href="#contact" className="section-offset text-sm text-white/55 hover:text-ember">
                  Contact
                </a>
              </li>
              <li>
                <a href="#location" className="section-offset text-sm text-white/55 hover:text-ember">
                  Location
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} IronGrid Fitness. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> {LOCATION_INFO.addressLine2}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={13} /> {LOCATION_INFO.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> {LOCATION_INFO.email}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
