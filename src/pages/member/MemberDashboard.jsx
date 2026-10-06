import React from "react";
import { Link } from "react-router-dom";
import { Flame, CalendarClock, Wallet, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { StatCard, ChartCard } from "../../components/Cards";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  MEMBERS,
  CLASSES,
  PAYMENTS,
  MY_VISIT_HISTORY,
  MY_BOOKED_CLASS_IDS,
} from "../../data/mockData";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const TODAY = new Date("2026-08-15");

export default function MemberDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token"); // Fallback if API not refactored
        const res = await fetch("http://localhost:5000/api/members/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setMe({
             ...data.data,
             expiry: "2027-08-15", // mock for now since real expiry logic might need payment integration
             plan: data.data.membershipPlan || "Standard"
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  const myPayments = PAYMENTS.filter((p) => p.member === user?.name);
  const nextClass = CLASSES.filter((c) => MY_BOOKED_CLASS_IDS.includes(c.id) && c.date >= "2026-08-15").sort(
    (a, b) => (a.date + a.time).localeCompare(b.date + b.time)
  )[0];

  const daysLeft = me ? Math.max(0, Math.ceil((new Date(me.expiry) - TODAY) / (1000 * 60 * 60 * 24))) : 0;
  const visitsThisMonth = MY_VISIT_HISTORY.filter((v) => v.date.startsWith("2026-08")).length;
  const pendingAmount = myPayments.filter((p) => p.status !== "paid").reduce((sum, p) => sum + p.amount, 0);

  const trend = MY_VISIT_HISTORY.slice()
    .reverse()
    .map((v, i) => ({ label: v.date.slice(5), minutes: parseDuration(v.duration) }));

  function handleCheckIn() {
    showToast("Checked in — have a great session!", "success");
  }

  if (loading) {
    return <div className="text-white/50">Loading your dashboard...</div>;
  }

  if (!me) {
    return <p className="text-sm text-white/50">We couldn't find your membership record.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm text-white/45">Saturday, 15 Aug 2026</h2>
          <p className="mt-1 text-2xl font-semibold text-white">Welcome back, {user.name.split(" ")[0]}</p>
        </div>
        <Button icon={CheckCircle2} onClick={handleCheckIn}>
          Check in now
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CalendarClock}
          label="Membership"
          value={`${daysLeft}d`}
          description={`${me.plan} plan · renews ${me.expiry}`}
        />
        <StatCard icon={Flame} label="Visits this month" value={String(visitsThisMonth)} description="Keep the streak going" />
        <StatCard
          icon={Wallet}
          label="Outstanding balance"
          value={pendingAmount ? `₹${pendingAmount.toLocaleString("en-IN")}` : "₹0"}
          description={pendingAmount ? "Payment pending" : "You're all paid up"}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. session"
          value={`${Math.round(trend.reduce((s, t) => s + t.minutes, 0) / trend.length)}m`}
          description="Last 7 visits"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Time in the gym" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="visitFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D7FF3B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#D7FF3B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#FFFFFF12" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#ffffff66", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#ffffff66", fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip
                contentStyle={{ background: "#1B1B1B", border: "1px solid #FFFFFF1A", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#fff" }}
              />
              <Area type="monotone" dataKey="minutes" stroke="#D7FF3B" fill="url(#visitFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Next class">
          {nextClass ? (
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold text-white">{nextClass.name}</p>
                <p className="text-xs text-white/40">with {nextClass.trainer}</p>
              </div>
              <p className="font-mono text-sm text-volt">
                {nextClass.date} · {nextClass.time}
              </p>
              <Badge status={nextClass.status}>{nextClass.status}</Badge>
              <Link to="/portal/classes">
                <Button variant="secondary" className="mt-2 w-full">
                  Manage bookings
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-white/50">No upcoming classes booked.</p>
              <Link to="/portal/classes">
                <Button icon={ArrowRight} className="w-full">
                  Browse classes
                </Button>
              </Link>
            </div>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Recent visits">
        <div className="divide-y divide-white/5">
          {MY_VISIT_HISTORY.slice(0, 5).map((v) => (
            <div key={v.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-white/70">{v.date}</span>
              <span className="font-mono text-white/50">
                {v.check_in} – {v.check_out}
              </span>
              <span className="text-white/40">{v.duration}</span>
            </div>
          ))}
        </div>
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
