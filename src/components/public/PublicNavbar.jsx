import React, { useEffect, useState } from "react";
import { Dumbbell, Menu, X } from "lucide-react";
import { BRANCH } from "../../data/mockData";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#membership", label: "Membership" },
  { href: "#training", label: "Training" },
  { href: "#classes", label: "Classes" },
  { href: "#nutrition", label: "Health & Nutrition" },
  { href: "#blog", label: "Blog" },
  { href: "#location", label: "Location" },
  { href: "#contact", label: "Contact" },
];

export default function PublicNavbar({ onLoginClick, onJoinClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleLinkClick() {
    setMobileOpen(false);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/95 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur" : "bg-black/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <a href="#home" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-white">
            <Dumbbell size={18} strokeWidth={2.5} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl tracking-wide text-white" style={{ letterSpacing: "0.04em" }}>
              IRONGRID
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.14em] text-white/40 sm:block">
              {BRANCH.location}
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="section-offset rounded-full px-3 py-2 text-[13px] font-medium uppercase tracking-wide text-white/65 transition-colors hover:text-ember"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={onLoginClick}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-ember hover:text-ember"
          >
            Login
          </button>
          <button
            onClick={onJoinClick}
            className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,75,34,0.4)] transition-transform hover:scale-[1.03] hover:bg-emberLight"
          >
            Join Now
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-white/10 bg-black/98 px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="section-offset border-b border-white/5 py-3.5 text-sm font-medium uppercase tracking-wide text-white/75 hover:text-ember"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={() => {
                handleLinkClick();
                onLoginClick();
              }}
              className="w-full rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
            >
              Login
            </button>
            <button
              onClick={() => {
                handleLinkClick();
                onJoinClick();
              }}
              className="w-full rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white"
            >
              Join Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
