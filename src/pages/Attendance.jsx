import React, { useState, useEffect } from "react";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Badge from "../components/Badge";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import { TabGroup, ChartCard } from "../components/Cards";
import { useToast } from "../context/ToastContext";
import { ATTENDANCE_WEEKLY } from "../data/mockData";
import { attendanceApi } from "../services/api";

const RANGE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState("today");
  const { showToast } = useToast();

  useEffect(() => {
    fetchAttendance();
  }, []);

  async function fetchAttendance() {
    try {
      setIsLoading(true);
      const res = await attendanceApi.list();
      const mappedRecords = (res.data || []).map((r) => {
        let durationStr = "—";
        if (r.checkIn && r.checkOut) {
          const [inH, inM] = r.checkIn.split(":").map(Number);
          const [outH, outM] = r.checkOut.split(":").map(Number);
          let diffM = (outH * 60 + outM) - (inH * 60 + inM);
          if (diffM < 0) diffM += 24 * 60; // crossed midnight
          const h = Math.floor(diffM / 60);
          const m = diffM % 60;
          durationStr = `${h > 0 ? h + "h " : ""}${m}m`;
        }

        return {
          _id: r._id,
          id: r._id, // frontend uses id
          member: r.memberId,
          check_in: r.checkIn,
          check_out: r.checkOut,
          duration: durationStr,
          status: r.status,
        };
      });
      setRecords(mappedRecords);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      showToast(err.message || "Failed to load attendance", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCheckIn() {
    try {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      await attendanceApi.create({
        memberId: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        checkIn: hhmm,
        status: "checked_in"
      });
      showToast("Check-in recorded", "success");
      fetchAttendance();
    } catch (err) {
      console.error("Failed to check in:", err);
      showToast(err.message || "Failed to check in", "error");
    }
  }

  async function toggleCheckout(row) {
    try {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      await attendanceApi.update(row._id, {
        checkOut: hhmm,
        status: "checked_out"
      });
      showToast(`${row.member} checked out`, "success");
      fetchAttendance();
    } catch (err) {
      console.error("Failed to check out:", err);
      showToast(err.message || "Failed to check out", "error");
    }
  }

  const columns = [
    { key: "member", label: "Member", sortable: true },
    { key: "check_in", label: "Check-in", sortable: true },
    { key: "check_out", label: "Check-out", render: (r) => r.check_out || "—" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
    {
      key: "actions",
      label: "",
      render: (r) =>
        r.status === "checked_in" ? (
          <Button variant="secondary" icon={LogOut} onClick={() => toggleCheckout(r)} className="!px-3 !py-1.5 !text-xs">
            Check out
          </Button>
        ) : (
          <span className="text-xs text-white/30">Complete</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-surface p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">
              Attendance log
            </h2>
            <div className="flex items-center gap-2">
              <TabGroup options={RANGE_OPTIONS} active={range} onChange={setRange} />
              <Button icon={LogIn} onClick={handleCheckIn} className="!px-3 !py-2 !text-xs">
                Check in
              </Button>
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center text-white/50">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Loading attendance...</span>
              </div>
            ) : (
              <DataTable columns={columns} rows={records} pageSize={6} emptyTitle="No attendance records" />
            )}
          </div>
        </div>

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
      </div>
    </div>
  );
}
