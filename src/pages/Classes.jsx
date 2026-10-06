import React, { useMemo, useState } from "react";
import { Plus, Clock, Users2 } from "lucide-react";
import Badge from "../components/Badge";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import { TabGroup } from "../components/Cards";
import { SearchInput, Select, Field, Input } from "../components/FormControls";
import { Modal } from "../components/Overlay";
import { useToast } from "../context/ToastContext";
import { CLASSES as INITIAL_CLASSES, TRAINERS } from "../data/mockData";

const emptyForm = { name: "", trainer: TRAINERS[0].name, date: "2026-08-15", time: "", capacity: 15 };

export default function Classes() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { showToast } = useToast();

  const dates = useMemo(() => [...new Set(classes.map((c) => c.date))], [classes]);

  const filtered = useMemo(() => {
    return classes.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.trainer.toLowerCase().includes(search.toLowerCase());
      const matchesDate = dateFilter === "all" || c.date === dateFilter;
      return matchesSearch && matchesDate;
    });
  }, [classes, search, dateFilter]);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.time) return;
    setClasses((prev) => [
      ...prev,
      { id: `CLS-${prev.length + 1}`.padStart(6, "0"), ...form, capacity: Number(form.capacity), enrolled: 0, status: "scheduled" },
    ]);
    showToast(`${form.name} added to the schedule`, "success");
    setForm(emptyForm);
    setFormOpen(false);
  }

  const columns = [
    { key: "name", label: "Class", sortable: true },
    { key: "trainer", label: "Trainer", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "time", label: "Time", sortable: true },
    { key: "enrolled", label: "Enrolled", render: (c) => `${c.enrolled}/${c.capacity}` },
    { key: "status", label: "Status", render: (c) => <Badge status={c.status} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search classes or trainers…" className="sm:w-56" />
          <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">All dates</option>
            {dates.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <TabGroup options={[{ id: "table", label: "Table" }, { id: "schedule", label: "Schedule" }]} active={view} onChange={setView} />
          <Button icon={Plus} onClick={() => setFormOpen(true)}>Add Class</Button>
        </div>
      </div>

      {view === "table" ? (
        <div className="rounded-2xl border border-white/10 bg-surface p-5">
          <DataTable columns={columns} rows={filtered} pageSize={7} emptyTitle="No classes scheduled" emptyDescription="Add a class to fill up the calendar." />
        </div>
      ) : (
        <div className="space-y-4">
          {dates
            .filter((d) => dateFilter === "all" || d === dateFilter)
            .map((d) => (
              <div key={d} className="rounded-2xl border border-white/10 bg-surface p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">{d}</h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.filter((c) => c.date === d).map((c) => (
                    <div key={c.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-white/50">
                          <Clock size={12} /> {c.time}
                        </span>
                        <Badge status={c.status} />
                      </div>
                      <p className="mt-2 text-sm font-medium text-white">{c.name}</p>
                      <p className="text-xs text-white/40">{c.trainer}</p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-white/40">
                        <Users2 size={12} /> {c.enrolled}/{c.capacity} enrolled
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Add class"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add class</Button>
          </>
        }
      >
        <form onSubmit={handleAdd} className="space-y-3">
          <Field label="Class name" id="c-name">
            <Input id="c-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Evening Yoga" />
          </Field>
          <Field label="Trainer" id="c-trainer">
            <Select id="c-trainer" className="w-full rounded-lg py-2" value={form.trainer} onChange={(e) => setForm((f) => ({ ...f, trainer: e.target.value }))}>
              {TRAINERS.map((t) => (
                <option key={t.id}>{t.name}</option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Date" id="c-date">
              <Input id="c-date" type="date" required value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </Field>
            <Field label="Time" id="c-time">
              <Input id="c-time" type="time" required value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
            </Field>
            <Field label="Capacity" id="c-cap">
              <Input id="c-cap" type="number" min="1" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} />
            </Field>
          </div>
        </form>
      </Modal>
    </div>
  );
}
