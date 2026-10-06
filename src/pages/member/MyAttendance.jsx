import React from "react";
import { Flame, Clock, CalendarCheck } from "lucide-react";
import { StatCard, ChartCard } from "../../components/Cards";
import DataTable from "../../components/DataTable";
import Button from "../../components/Button";
import { useToast } from "../../context/ToastContext";
import { MY_VISIT_HISTORY } from "../../data/mockData";

export default function MyAttendance() {
  const { showToast } = useToast();
  const thisWeek = MY_VISIT_HISTORY.filter((v) => v.date >= "2026-08-09").length;
  const avgMinutes = Math.round(
    MY_VISIT_HISTORY.reduce((s, v) => s + parseDuration(v.duration), 0) / MY_VISIT_HISTORY.length
  );

  const columns = [
    { key: "date", label: "Date", sortable: true },
    { key: "check_in", label: "Check in" },
    { key: "check_out", label: "Check out" },
    { key: "duration", label: "Duration" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">My Visits</h2>
          <p className="mt-1 text-sm text-white/45">Your check-in history at IronGrid Fitness.</p>
        </div>
        <Button onClick={() => showToast("Checked in — have a great session!", "success")}>Check in now</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarCheck} label="Visits this week" value={String(thisWeek)} />
        <StatCard icon={Clock} label="Avg. session" value={`${avgMinutes}m`} />
        <StatCard icon={Flame} label="Total logged visits" value={String(MY_VISIT_HISTORY.length)} />
      </div>

      <ChartCard title="Visit history">
        <DataTable columns={columns} rows={MY_VISIT_HISTORY} emptyTitle="No visits logged yet" />
      </ChartCard>
    </div>
  );
}

function parseDuration(str) {
  const match = str.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;
  const h = parseInt(match[1] || "0", 10);
  const m = parseInt(match[2] || "0", 10);
  return h * 60 + m;
}
