import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { ChartCard } from "../../components/Cards";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { MEMBERS, MEMBERSHIP_PLANS } from "../../data/mockData";

export default function MyMembership() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/members/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setMe({
             ...data.data,
             expiry: "2027-08-15",
             joined: data.data.joinDate ? data.data.joinDate.split('T')[0] : "2026-01-01",
             plan: data.data.membershipPlan || "Standard",
             payment_status: "paid"
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

  const currentPlan = MEMBERSHIP_PLANS.find((p) => p.name === me?.plan);

  function handleRenew() {
    showToast("Renewal request sent — front desk will confirm shortly.", "success");
  }

  function handleUpgrade(planName) {
    showToast(`Request sent to switch to the ${planName} plan.`, "success");
  }

  if (loading) return <div className="text-white/50">Loading membership details...</div>;
  if (!me) return null;

  return (
    <div className="space-y-6">
      <ChartCard
        title="Current plan"
        actions={<Badge status={me.status}>{me.status}</Badge>}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-4xl tracking-wide text-volt">{me.plan}</p>
            <p className="mt-1 text-sm text-white/45">
              Member since {me.joined} · Renews {me.expiry}
            </p>
            <ul className="mt-4 space-y-2">
              {(currentPlan?.features ?? []).map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle2 size={14} className="shrink-0 text-volt" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:w-56">
            <p className="text-xs uppercase tracking-[0.12em] text-white/40">Payment status</p>
            <p className="mt-1 font-mono text-lg text-white">
              {currentPlan ? `₹${currentPlan.price.toLocaleString("en-IN")}` : "—"}
              <span className="text-xs text-white/40"> / {currentPlan?.duration}</span>
            </p>
            <Badge status={me.payment_status} >{me.payment_status}</Badge>
            <Button variant="secondary" className="mt-4 w-full" onClick={handleRenew}>
              Request renewal
            </Button>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Other plans" actions={<Sparkles size={16} className="text-volt" />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MEMBERSHIP_PLANS.filter((p) => p.name !== me.plan).map((plan) => (
            <div key={plan.id} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">{plan.name}</p>
              <p className="mt-1 font-mono text-2xl text-white">
                ₹{plan.price.toLocaleString("en-IN")}
                <span className="text-xs text-white/40"> / {plan.duration}</span>
              </p>
              <ul className="mt-3 flex-1 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-white/50">
                    · {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="mt-4 w-full" onClick={() => handleUpgrade(plan.name)}>
                Switch to {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
