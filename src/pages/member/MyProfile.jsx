import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ChartCard } from "../../components/Cards";
import { Field, Input } from "../../components/FormControls";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { MEMBERS } from "../../data/mockData";

const PREFS = [
  { key: "expiry", label: "Membership expiry reminders" },
  { key: "classes", label: "Class booking confirmations" },
  { key: "payments", label: "Payment receipts" },
  { key: "promos", label: "Offers & announcements" },
];

export default function MyProfile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const me = MEMBERS.find((m) => m.id === user?.memberId);

  const [form, setForm] = useState({ name: user?.name ?? "", email: me?.email ?? "", phone: me?.phone ?? "" });
  const [prefs, setPrefs] = useState({ expiry: true, classes: true, payments: true, promos: false });

  function handleSave(e) {
    e.preventDefault();
    showToast("Profile updated.", "success");
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="space-y-6">
      <ChartCard title="Profile details">
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" id="name">
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email" id="email">
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Phone" id="phone">
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Member ID" id="mid">
            <Input id="mid" value={me?.id ?? ""} disabled className="opacity-50" />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </ChartCard>

      <ChartCard title="Notification preferences">
        <div className="space-y-3">
          {PREFS.map((p) => (
            <label key={p.key} className="flex items-center justify-between rounded-lg px-1 py-1.5">
              <span className="text-sm text-white/70">{p.label}</span>
              <input
                type="checkbox"
                checked={prefs[p.key]}
                onChange={(e) => setPrefs({ ...prefs, [p.key]: e.target.checked })}
                className="h-4 w-4 rounded accent-[#D7FF3B]"
              />
            </label>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Account">
        <Button variant="danger" icon={LogOut} onClick={handleLogout}>
          Log out
        </Button>
      </ChartCard>
    </div>
  );
}
