import React, { useMemo, useState } from "react";
import { Plus, Wrench, CheckCircle2, AlertTriangle, Ban } from "lucide-react";
import Badge from "../components/Badge";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import { StatCard } from "../components/Cards";
import { SearchInput, Select, Field, Input } from "../components/FormControls";
import { Modal } from "../components/Overlay";
import { useToast } from "../context/ToastContext";
import { EQUIPMENT as INITIAL_EQUIPMENT } from "../data/mockData";

const CONDITION_ICON = {
  good: CheckCircle2,
  needs_maintenance: AlertTriangle,
  under_maintenance: Wrench,
  damaged: Ban,
};

const emptyForm = { name: "", category: "Free weights", quantity: 1, condition: "good" };

export default function Equipment() {
  const [items, setItems] = useState(INITIAL_EQUIPMENT);
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { showToast } = useToast();

  const counts = useMemo(() => {
    return {
      good: items.filter((i) => i.condition === "good").length,
      needsMaint: items.filter((i) => i.condition === "needs_maintenance").length,
      underMaint: items.filter((i) => i.condition === "under_maintenance").length,
      damaged: items.filter((i) => i.condition === "damaged").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
      const matchesCondition = conditionFilter === "all" || i.condition === conditionFilter;
      return matchesSearch && matchesCondition;
    });
  }, [items, search, conditionFilter]);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: `EQP-${prev.length + 1}`.padStart(6, "0"), ...form, quantity: Number(form.quantity), purchased: "2026-08-15", last_maintenance: "2026-08-15" },
    ]);
    showToast(`${form.name} added to inventory`, "success");
    setForm(emptyForm);
    setFormOpen(false);
  }

  const columns = [
    { key: "name", label: "Equipment", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "quantity", label: "Qty", sortable: true },
    { key: "purchased", label: "Purchased", sortable: true },
    { key: "last_maintenance", label: "Last serviced", sortable: true },
    {
      key: "condition",
      label: "Condition",
      render: (i) => {
        const Icon = CONDITION_ICON[i.condition];
        return (
          <span className="inline-flex items-center gap-1.5">
            <Icon size={13} className="text-white/40" />
            <Badge status={i.condition} />
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Good condition" value={counts.good} />
        <StatCard icon={AlertTriangle} label="Needs maintenance" value={counts.needsMaint} up={false} />
        <StatCard icon={Wrench} label="Under maintenance" value={counts.underMaint} />
        <StatCard icon={Ban} label="Damaged" value={counts.damaged} up={false} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">Inventory ({filtered.length})</h2>
          <div className="flex flex-wrap gap-2">
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search equipment…" className="w-full sm:w-56" />
            <Select value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
              <option value="all">All conditions</option>
              <option value="good">Good</option>
              <option value="needs_maintenance">Needs maintenance</option>
              <option value="under_maintenance">Under maintenance</option>
              <option value="damaged">Damaged</option>
            </Select>
            <Button icon={Plus} onClick={() => setFormOpen(true)}>Add Equipment</Button>
          </div>
        </div>
        <div className="mt-4">
          <DataTable columns={columns} rows={filtered} pageSize={7} emptyTitle="No equipment found" emptyDescription="Adjust your filters or add a new item." />
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Add equipment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add item</Button>
          </>
        }
      >
        <form onSubmit={handleAdd} className="space-y-3">
          <Field label="Equipment name" id="e-name">
            <Input id="e-name" required value={form.name} onChange={(ev) => setForm((f) => ({ ...f, name: ev.target.value }))} placeholder="e.g. Kettlebell set" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category" id="e-cat">
              <Select id="e-cat" className="w-full rounded-lg py-2" value={form.category} onChange={(ev) => setForm((f) => ({ ...f, category: ev.target.value }))}>
                <option>Free weights</option>
                <option>Cardio</option>
                <option>Machines</option>
                <option>Accessories</option>
              </Select>
            </Field>
            <Field label="Quantity" id="e-qty">
              <Input id="e-qty" type="number" min="1" value={form.quantity} onChange={(ev) => setForm((f) => ({ ...f, quantity: ev.target.value }))} />
            </Field>
          </div>
          <Field label="Condition" id="e-cond">
            <Select id="e-cond" className="w-full rounded-lg py-2" value={form.condition} onChange={(ev) => setForm((f) => ({ ...f, condition: ev.target.value }))}>
              <option value="good">Good</option>
              <option value="needs_maintenance">Needs maintenance</option>
              <option value="under_maintenance">Under maintenance</option>
              <option value="damaged">Damaged</option>
            </Select>
          </Field>
        </form>
      </Modal>
    </div>
  );
}
