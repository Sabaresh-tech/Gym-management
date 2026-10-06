import React, { useState } from "react";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { Field, Input } from "../FormControls";
import { useToast } from "../../context/ToastContext";
import { LOCATION_INFO } from "../../data/publicContent";

const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactSection() {
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast("Please fill in your name, email and message.", "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm(EMPTY_FORM);
      showToast("Message sent — we'll get back to you shortly.", "success");
    }, 500);
  }

  return (
    <section id="contact" className="section-offset bg-black py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Contact</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl">
            LET'S TALK
          </h2>
          <p className="mt-4 text-white/55">
            Questions about memberships, training or a tour of the floor?
            Send us a message and the team will follow up.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember">
                <Phone size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Call Us</p>
                <p className="text-sm text-white/50">{LOCATION_INFO.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember">
                <Mail size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Email Us</p>
                <p className="text-sm text-white/50">{LOCATION_INFO.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember">
                <MapPin size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Visit Us</p>
                <p className="text-sm text-white/50">
                  {LOCATION_INFO.addressLine1}, {LOCATION_INFO.addressLine2}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-3" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" id="contact-name">
                <Input id="contact-name" value={form.name} onChange={update("name")} placeholder="Your full name" />
              </Field>
              <Field label="Email" id="contact-email">
                <Input id="contact-email" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone" id="contact-phone">
                <Input id="contact-phone" value={form.phone} onChange={update("phone")} placeholder="+91 98200 00000" />
              </Field>
              <Field label="Subject" id="contact-subject">
                <Input id="contact-subject" value={form.subject} onChange={update("subject")} placeholder="Membership enquiry" />
              </Field>
            </div>
            <Field label="Message" id="contact-message">
              <textarea
                id="contact-message"
                rows={5}
                value={form.message}
                onChange={update("message")}
                placeholder="Tell us what you're looking for…"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/40"
              />
            </Field>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-emberLight disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Send size={15} />
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
