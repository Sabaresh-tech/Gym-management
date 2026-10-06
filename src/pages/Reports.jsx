import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Button from "../components/Button";
import { ChartCard } from "../components/Cards";
import { Select, Input } from "../components/FormControls";
import { useToast } from "../context/ToastContext";
import {
  MEMBERSHIP_TRENDS, REVENUE_BY_MONTH, REVENUE_BY_PLAN, ATTENDANCE_WEEKLY, PEAK_HOURS, TRAINERS,
} from "../data/mockData";

const REPORTS = [
  { id: "membership", label: "Membership Report" },
  { id: "revenue", label: "Revenue Report" },
  { id: "attendance", label: "Attendance Report" },
  { id: "trainers", label: "Trainer Performance" },
];

const PIE_COLORS = ["#D7FF3B", "#8FDB3B", "#4FBF7A", "#3BA6D7", "#7A6BD7"];

export default function Reports() {
  const [report, setReport] = useState("membership");
  const [from, setFrom] = useState("2026-03-01");
  const [to, setTo] = useState("2026-08-15");
  const { showToast } = useToast();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={report} onChange={(e) => setReport(e.target.value)}>
              {REPORTS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </Select>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-auto rounded-full py-2 text-xs" />
            <span className="text-xs text-white/30">to</span>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-auto rounded-full py-2 text-xs" />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" icon={Download} onClick={() => showToast(`${REPORTS.find((r) => r.id === report).label} exported as CSV`, "success")}>
              CSV
            </Button>
            <Button variant="secondary" icon={FileText} onClick={() => showToast(`${REPORTS.find((r) => r.id === report).label} exported as PDF`, "success")}>
              PDF
            </Button>
          </div>
        </div>
      </div>

      {report === "membership" && (
        <ChartCard title="New vs. renewals vs. expired">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MEMBERSHIP_TRENDS} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid stroke="#ffffff0f" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: "#ffffff0a" }} contentStyle={{ background: "#1b1b1b", border: "1px solid #ffffff22", borderRadius: 10, fontSize: 12, color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#ffffff99" }} />
                <Bar dataKey="new" stackId="a" fill="#D7FF3B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="renewals" stackId="a" fill="#4FBF7A" />
                <Bar dataKey="expired" stackId="a" fill="#FF5A36" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {report === "revenue" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Monthly revenue">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_BY_MONTH} margin={{ left: -20, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="repRevFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D7FF3B" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#D7FF3B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff0f" vertical={false} />
                  <XAxis dataKey="month" stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ background: "#1b1b1b", border: "1px solid #ffffff22", borderRadius: 10, fontSize: 12, color: "#fff" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#D7FF3B" strokeWidth={2} fill="url(#repRevFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Revenue by plan">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={REVENUE_BY_PLAN} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {REVENUE_BY_PLAN.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12, color: "#ffffff99" }} />
                  <Tooltip contentStyle={{ background: "#1b1b1b", border: "1px solid #ffffff22", borderRadius: 10, fontSize: 12, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {report === "attendance" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Weekly attendance">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ATTENDANCE_WEEKLY} margin={{ left: -20, right: 10, top: 10 }}>
                  <CartesianGrid stroke="#ffffff0f" vertical={false} />
                  <XAxis dataKey="day" stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "#ffffff0a" }} contentStyle={{ background: "#1b1b1b", border: "1px solid #ffffff22", borderRadius: 10, fontSize: 12, color: "#fff" }} />
                  <Bar dataKey="visits" fill="#D7FF3B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Peak hours">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PEAK_HOURS} margin={{ left: -20, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="peakFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D7FF3B" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#D7FF3B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff0f" vertical={false} />
                  <XAxis dataKey="hour" stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ background: "#1b1b1b", border: "1px solid #ffffff22", borderRadius: 10, fontSize: 12, color: "#fff" }} />
                  <Area type="monotone" dataKey="visits" stroke="#D7FF3B" strokeWidth={2} fill="url(#peakFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {report === "trainers" && (
        <ChartCard title="Trainer performance">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                  <th className="pb-2 pr-4 font-medium">Trainer</th>
                  <th className="pb-2 pr-4 font-medium">Specialization</th>
                  <th className="pb-2 pr-4 font-medium">Assigned members</th>
                  <th className="pb-2 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {TRAINERS.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4 font-medium text-white">{t.name}</td>
                    <td className="py-3 pr-4 text-white/60">{t.specialization}</td>
                    <td className="py-3 pr-4 text-white/60">{t.assigned_members}</td>
                    <td className="py-3 text-volt">{t.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
