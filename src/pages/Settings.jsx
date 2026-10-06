import React, { useState } from "react";
import {
  Building2, UserCircle, CreditCard, Bell, ShieldCheck, Palette,
} from "lucide-react";
import Button from "../components/Button";
import { Field, Input, Select } from "../components/FormControls";
import { useToast } from "../context/ToastContext";

const SECTIONS = [
  { id: "gym", label: "Gym Profile", icon: Building2 },
  { id: "admin", label: "Admin Profile", icon: UserCircle },
  { id: "membership", label: "Membership Settings", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function Toggle({ label, description, defaultChecked = true }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm text-white/85">{label}</p>
        {description && <p className="text-xs text-white/40">{description}</p>}
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-volt" : "bg-white/15"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-black transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [active, setActive] = useState("gym");
  const { showToast } = useToast();

  function save() {
    showToast("Settings saved", "success");
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
      <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-surface p-2 lg:flex-col lg:overflow-visible">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                active === s.id ? "bg-volt text-black font-medium" : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {s.label}
            </button>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-white/10 bg-surface p-5">
        {active === "gym" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">Gym profile</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Gym name" id="s-name"><Input id="s-name" defaultValue="IronGrid Fitness" /></Field>
              <Field label="Branch location" id="s-loc"><Input id="s-loc" defaultValue="Kalyan, Maharashtra" /></Field>
              <Field label="Contact email" id="s-email"><Input id="s-email" defaultValue="hello@irongrid.fit" /></Field>
              <Field label="Contact phone" id="s-phone"><Input id="s-phone" defaultValue="+91 98200 00000" /></Field>
            </div>
            <Field label="Operating hours" id="s-hours"><Input id="s-hours" defaultValue="Mon–Sun, 6:00 AM – 10:00 PM" /></Field>
          </div>
        )}

        {active === "admin" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">Admin profile</h2>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-volt text-lg font-semibold text-black">SM</span>
              <Button variant="secondary">Change photo</Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Full name" id="a-name"><Input id="a-name" defaultValue="Sana Mirza" /></Field>
              <Field label="Role" id="a-role">
                <Select id="a-role" className="w-full rounded-lg py-2" defaultValue="Front desk">
                  <option>Owner</option>
                  <option>Manager</option>
                  <option>Front desk</option>
                </Select>
              </Field>
              <Field label="Email" id="a-email"><Input id="a-email" defaultValue="sana.mirza@irongrid.fit" /></Field>
              <Field label="Phone" id="a-phone"><Input id="a-phone" defaultValue="+91 98200 12345" /></Field>
            </div>
          </div>
        )}

        {active === "membership" && (
          <div className="space-y-1">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.1em] text-white/70">Membership settings</h2>
            <Toggle label="Auto-renew memberships" description="Renew active memberships automatically unless cancelled" />
            <Toggle label="Grace period on expiry" description="Allow 3 days of access after a plan expires" />
            <Toggle label="Freeze requests" description="Let members request a temporary membership freeze" defaultChecked={false} />
          </div>
        )}

        {active === "notifications" && (
          <div className="space-y-1">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.1em] text-white/70">Notification settings</h2>
            <Toggle label="Membership expiry alerts" description="Notify staff 7 days before a membership expires" />
            <Toggle label="Payment reminders" description="Notify staff when a payment becomes overdue" />
            <Toggle label="Equipment maintenance alerts" description="Notify staff when scheduled servicing is due" />
            <Toggle label="New member notifications" description="Notify staff when someone signs up" defaultChecked={false} />
          </div>
        )}

        {active === "security" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">Security</h2>
            <Field label="Current password" id="pw-cur"><Input id="pw-cur" type="password" placeholder="••••••••" /></Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="New password" id="pw-new"><Input id="pw-new" type="password" placeholder="••••••••" /></Field>
              <Field label="Confirm new password" id="pw-conf"><Input id="pw-conf" type="password" placeholder="••••••••" /></Field>
            </div>
            <Toggle label="Two-factor authentication" description="Require a code at login in addition to your password" defaultChecked={false} />
          </div>
        )}

        {active === "appearance" && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">Appearance</h2>
            <p className="text-xs text-white/40">IronGrid ships in dark mode by default, tuned for gym-floor tablets and dim front-desk lighting.</p>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl border-2 border-volt bg-[#0D0D0D] p-3 text-center text-xs text-white/70">Dark (active)</div>
              <div className="flex-1 rounded-xl border border-white/10 bg-white p-3 text-center text-xs text-black/40">Light (coming soon)</div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
          <Button onClick={save}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
