import React from "react";
import { Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard, ChartCard } from "../../components/Cards";
import Badge from "../../components/Badge";
import DataTable from "../../components/DataTable";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { PAYMENTS } from "../../data/mockData";

export default function MyPayments() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const myPayments = PAYMENTS.filter((p) => p.member === user?.name);
  const totalPaid = myPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = myPayments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  const columns = [
    { key: "id", label: "Transaction", sortable: true },
    { key: "plan", label: "Plan" },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row) => <span className="font-mono">₹{row.amount.toLocaleString("en-IN")}</span>,
    },
    { key: "method", label: "Method" },
    { key: "date", label: "Date", sortable: true },
    { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
    {
      key: "actions",
      label: "",
      render: (row) =>
        row.status !== "paid" && (
          <Button variant="secondary" onClick={() => showToast(`Payment reminder sent for ${row.id}.`, "info")}>
            Pay now
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total paid" value={`₹${totalPaid.toLocaleString("en-IN")}`} />
        <StatCard icon={AlertCircle} label="Pending" value={`₹${pending.toLocaleString("en-IN")}`} />
        <StatCard icon={CheckCircle2} label="Transactions" value={String(myPayments.length)} />
      </div>

      <ChartCard title="Payment history">
        <DataTable columns={columns} rows={myPayments} emptyTitle="No payments yet" />
      </ChartCard>
    </div>
  );
}
