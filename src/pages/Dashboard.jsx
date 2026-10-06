import React, { useState } from "react";
import { Users, Flame, Wallet, CalendarDays, Clock, AlertCircle, Plus } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { StatCard, ChartCard, TabGroup } from "../components/Cards";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { Modal } from "../components/Overlay";
import { Field, Input, Select } from "../components/FormControls";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import {
  REVENUE_BY_MONTH, ATTENDANCE_WEEKLY, CLASSES, NOTIFICATIONS, MEMBERS,
} from "../data/mockData";

const STATS = [
  { icon: Users, label: "Total Members", value: "1,284", delta: "+12.5%", up: true, description: "vs. last month" },
  { icon: Flame, label: "Active Members", value: "1,096", delta: "+6.1%", up: true, description: "checked in last 30 days" },
  { icon: Plus, label: "New Members", value: "47", delta: "+9.3%", up: true, description: "this month" },
  { icon: Wallet, label: "Monthly Revenue", value: "\u20B948,960", delta: "+2.1%", up: true, description: "vs. last month" },
  { icon: AlertCircle, label: "Pending Payments", value: "\u20B96,597", delta: "-3.4%", up: false, description: "5 invoices outstanding" },
  { icon: CalendarDays, label: "Today's Attendance", value: "212", delta: "+11.8%", up: true, description: "of 260 avg. capacity" },
];

export default function Dashboard() {
  const [chartTab, setChartTab] = useState("revenue");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", plan: "Standard" });
  const { showToast } = useToast();
  const { user } = useAuth();
  const todaysClasses = CLASSES.filter((c) => c.date === "2026-08-15");

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    showToast(`${form.name} added as a new member`, "success");
    setForm({ name: "", plan: "Standard" });
    setShowModal(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm text-white/45">Saturday, 15 Aug 2026 · IronGrid Fitness, Kalyan</h2>
          <p className="mt-1 text-2xl font-semibold text-white">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"}
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Revenue & Attendance"
          className="lg:col-span-2"
          actions={
            <TabGroup
              options={[
                { id: "revenue", label: "Revenue" },
                { id: "attendance", label: "Attendance" },
              ]}
              active={chartTab}
              onChange={setChartTab}
            />
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartTab === "revenue" ? (
                <AreaChart data={REVENUE_BY_MONTH} margin={{ left: -20, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D7FF3B" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#D7FF3B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff0f" vertical={false} />
                  <XAxis dataKey="month" stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ background: "#1b1b1b", border: "1px solid #ffffff22", borderRadius: 10, fontSize: 12, color: "#fff" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#D7FF3B" strokeWidth={2} fill="url(#revFill)" />
                </AreaChart>
              ) : (
                <BarChart data={ATTENDANCE_WEEKLY} margin={{ left: -20, right: 10, top: 10 }}>
                  <CartesianGrid stroke="#ffffff0f" vertical={false} />
                  <XAxis dataKey="day" stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "#ffffff0a" }} contentStyle={{ background: "#1b1b1b", border: "1px solid #ffffff22", borderRadius: 10, fontSize: 12, color: "#fff" }} />
                  <Bar dataKey="visits" fill="#D7FF3B" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Today's Schedule">
          <div className="no-scrollbar max-h-64 space-y-2 overflow-y-auto pr-1">
            {todaysClasses.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex flex-col items-center rounded-lg bg-white/5 px-2 py-1 text-[11px] text-white/60">
                  <Clock size={12} className="mb-0.5" />
                  {c.time}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{c.name}</p>
                  <p className="truncate text-xs text-white/40">{c.trainer}</p>
                </div>
                <Badge status={c.status}>{`${c.enrolled}/${c.capacity}`}</Badge>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Recent Members" className="lg:col-span-2">
          <div className="space-y-2">
            {MEMBERS.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-white/70">
                    {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{m.name}</p>
                    <p className="truncate text-xs text-white/40">{m.plan} plan · joined {m.joined}</p>
                  </div>
                </div>
                <Badge status={m.status} />
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Alerts">
          <div className="space-y-2">
            {NOTIFICATIONS.slice(0, 4).map((n) => (
              <div key={n.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <p className="text-sm text-white/85">{n.title}</p>
                <p className="mt-0.5 text-xs text-white/40">{n.detail}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save member</Button>
          </>
        }
      >
        <form onSubmit={handleAdd} className="space-y-3">
          <Field label="Full name" id="name">
            <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Arjun Verma" />
          </Field>
          <Field label="Plan" id="plan">
            <Select id="plan" className="w-full rounded-lg py-2" value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}>
              <option>Basic</option>
              <option>Standard</option>
              <option>Premium</option>
              <option>Annual</option>
              <option>Student</option>
            </Select>
          </Field>
        </form>
      </Modal>
    </div>
  );
}
