import React, { useMemo, useState } from "react";
import { Wallet, CheckCircle2, Clock, AlertTriangle, Download, Eye } from "lucide-react";
import { StatCard } from "../components/Cards";
import Badge from "../components/Badge";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import { SearchInput, Select, Input } from "../components/FormControls";
import { Modal } from "../components/Overlay";
import { useToast } from "../context/ToastContext";
import { PAYMENTS } from "../data/mockData";

export default function Payments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [viewing, setViewing] = useState(null);
  const { showToast } = useToast();

  const totals = useMemo(() => {
    const total = PAYMENTS.reduce((s, p) => s + p.amount, 0);
    const paid = PAYMENTS.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
    const pending = PAYMENTS.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
    const overdue = PAYMENTS.filter((p) => p.status === "overdue").reduce((s, p) => s + p.amount, 0);
    return { total, paid, pending, overdue };
  }, []);

  const filtered = useMemo(() => {
    return PAYMENTS.filter((p) => {
      const matchesSearch = p.member.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesMethod = methodFilter === "all" || p.method === methodFilter;
      const matchesDate = !dateFrom || p.date >= dateFrom;
      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });
  }, [search, statusFilter, methodFilter, dateFrom]);

  const columns = [
    { key: "id", label: "Transaction", sortable: true, render: (p) => <span className="font-mono text-xs text-white/70">{p.id}</span> },
    { key: "member", label: "Member", sortable: true },
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount", sortable: true, render: (p) => <span className="font-mono">₹{p.amount.toLocaleString("en-IN")}</span> },
    { key: "method", label: "Method" },
    { key: "date", label: "Date", sortable: true },
    { key: "status", label: "Status", render: (p) => <Badge status={p.status} /> },
    {
      key: "actions",
      label: "",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => setViewing(p)} aria-label="View payment" className="flex h-7 w-7 items-center justify-center rounded-full text-white/40 hover:bg-white/5 hover:text-white">
            <Eye size={14} />
          </button>
          <button onClick={() => showToast(`Invoice ${p.id} downloaded`, "success")} aria-label="Download invoice" className="flex h-7 w-7 items-center justify-center rounded-full text-white/40 hover:bg-white/5 hover:text-white">
            <Download size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total Revenue" value={`₹${totals.total.toLocaleString("en-IN")}`} />
        <StatCard icon={CheckCircle2} label="Paid" value={`₹${totals.paid.toLocaleString("en-IN")}`} up delta="on track" />
        <StatCard icon={Clock} label="Pending" value={`₹${totals.pending.toLocaleString("en-IN")}`} />
        <StatCard icon={AlertTriangle} label="Overdue" value={`₹${totals.overdue.toLocaleString("en-IN")}`} up={false} delta="needs follow-up" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">Transactions ({filtered.length})</h2>
          <div className="flex flex-wrap gap-2">
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search member or ID…" className="w-full sm:w-52" />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </Select>
            <Select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
              <option value="all">All methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Select>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-auto rounded-full py-2 text-xs" />
          </div>
        </div>
        <div className="mt-4">
          <DataTable columns={columns} rows={filtered} pageSize={6} emptyTitle="No transactions found" emptyDescription="Adjust your filters to see more results." />
        </div>
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Payment details">
        {viewing && (
          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm">
            {[
              ["Transaction ID", viewing.id],
              ["Member", viewing.member],
              ["Plan", viewing.plan],
              ["Amount", `₹${viewing.amount.toLocaleString("en-IN")}`],
              ["Method", viewing.method],
              ["Date", viewing.date],
            ].map(([label, val]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-wide text-white/35">{label}</dt>
                <dd className="mt-0.5 text-white/85">{val}</dd>
              </div>
            ))}
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/35">Status</dt>
              <dd className="mt-1"><Badge status={viewing.status} /></dd>
            </div>
          </dl>
        )}
      </Modal>
    </div>
  );
}
