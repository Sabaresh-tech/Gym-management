import React, { useMemo, useState, useEffect } from "react";
import { Plus, Star, Phone, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import Button from "../components/Button";
import { SearchInput, Select, Field, Input } from "../components/FormControls";
import { Modal, ConfirmDialog, EmptyState } from "../components/Overlay";
import { useToast } from "../context/ToastContext";
import { trainersApi } from "../services/api";

const SPECIALIZATIONS = ["All", "Strength & Conditioning", "Powerlifting", "Yoga & Mobility", "Boxing & HIIT", "CrossFit"];
const emptyForm = { name: "", specialization: "Strength & Conditioning", experience: "", availability: "", password: "" };

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTrainers();
  }, []);

  async function fetchTrainers() {
    try {
      setIsLoading(true);
      const res = await trainersApi.list();
      const mappedTrainers = (res.data || []).map((t) => ({
        _id: t._id,
        id: t.trainerId,
        name: t.name,
        specialization: t.specialization,
        experience: `${t.experience} yrs`,
        assigned_members: 0,
        rating: 0,
        availability: "Mon–Fri, 6am–2pm", // UI fallback
      }));
      setTrainers(mappedTrainers);
    } catch (err) {
      console.error("Failed to fetch trainers:", err);
      showToast(err.message || "Failed to load trainers", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return trainers.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesSpec = spec === "All" || t.specialization === spec;
      return matchesSearch && matchesSpec;
    });
  }, [trainers, search, spec]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(t) {
    setEditing(t);
    setForm({ name: t.name, specialization: t.specialization, experience: t.experience, availability: t.availability, password: "" });
    setFormOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    // Parse out just the number for the backend
    const expMatch = String(form.experience).match(/\d+/);
    const expNumber = expMatch ? parseInt(expMatch[0], 10) : 0;

    const payload = {
      name: form.name,
      specialization: form.specialization,
      experience: expNumber,
      status: "active",
      ...(form.password && { password: form.password })
    };

    try {
      if (editing) {
        await trainersApi.update(editing._id, payload);
        showToast(`${form.name}'s profile updated`, "success");
      } else {
        payload.trainerId = `TRN-${Math.floor(100 + Math.random() * 900)}`;
        // Fallback required backend fields that aren't in the form
        payload.email = `${form.name.replace(/\s+/g, "").toLowerCase()}@gym.com`;
        payload.phone = "+910000000000";
        await trainersApi.create(payload);
        showToast(`${form.name} added to your trainer roster`, "success");
      }
      setFormOpen(false);
      fetchTrainers();
    } catch (err) {
      console.error("Failed to save trainer:", err);
      showToast(err.message || "Failed to save trainer", "error");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await trainersApi.remove(deleting._id);
      showToast(`${deleting.name} removed from roster`, "info");
      setDeleting(null);
      fetchTrainers();
    } catch (err) {
      console.error("Failed to delete trainer:", err);
      showToast(err.message || "Failed to delete trainer", "error");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search trainers…" className="sm:w-56" />
          <Select value={spec} onChange={(e) => setSpec(e.target.value)}>
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add Trainer</Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-white/50">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Loading trainers...</span>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No trainers found" description="Try a different search or specialization filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-2xl border border-white/10 bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white/70">
                    {t.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </span>
                  <div>
                    <p className="font-medium text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.specialization}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-volt/15 px-2 py-0.5 text-xs font-medium text-volt">
                  <Star size={11} fill="currentColor" /> {t.rating || "—"}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-white/35">Experience</dt>
                  <dd className="mt-0.5 text-white/75">{t.experience}</dd>
                </div>
                <div>
                  <dt className="text-white/35">Assigned</dt>
                  <dd className="mt-0.5 text-white/75">{t.assigned_members} members</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-white/35">Availability</dt>
                  <dd className="mt-0.5 text-white/75">{t.availability}</dd>
                </div>
              </dl>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" icon={Phone} className="flex-1" onClick={() => showToast(`Calling ${t.name}…`, "info")}>
                  Contact
                </Button>
                <button onClick={() => setViewing(t)} aria-label={`View ${t.name}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:bg-white/5 hover:text-white">
                  <Eye size={15} />
                </button>
                <button onClick={() => openEdit(t)} aria-label={`Edit ${t.name}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:bg-white/5 hover:text-white">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeleting(t)} aria-label={`Delete ${t.name}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:bg-alert/10 hover:text-[#FF8A66]">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit trainer" : "Add trainer"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save changes" : "Add trainer"}</Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-3">
          <Field label="Full name" id="t-name">
            <Input id="t-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Zara Khan" />
          </Field>
          <Field label="Specialization" id="t-spec">
            <Select id="t-spec" className="w-full rounded-lg py-2" value={form.specialization} onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}>
              {SPECIALIZATIONS.filter((s) => s !== "All").map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Experience" id="t-exp">
              <Input id="t-exp" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} placeholder="3 yrs" />
            </Field>
            <Field label="Availability" id="t-avail">
              <Input id="t-avail" value={form.availability} onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))} placeholder="Mon–Fri, 6am–2pm" />
            </Field>
          </div>
          {!editing && (
            <Field label="Password (for login)" id="t-pwd">
              <Input id="t-pwd" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Set a password" />
            </Field>
          )}
        </form>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Trainer profile">
        {viewing && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white/70">
                {viewing.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </span>
              <div>
                <p className="font-medium text-white">{viewing.name}</p>
                <p className="text-xs text-white/40">{viewing.id}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
              {[
                ["Specialization", viewing.specialization],
                ["Experience", viewing.experience],
                ["Assigned members", viewing.assigned_members],
                ["Rating", viewing.rating || "—"],
                ["Availability", viewing.availability],
              ].map(([label, val]) => (
                <div key={label}>
                  <dt className="text-[11px] uppercase tracking-wide text-white/35">{label}</dt>
                  <dd className="mt-0.5 text-white/85">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Remove trainer"
        description={deleting ? `${deleting.name} will be unassigned from ${deleting.assigned_members} members. This can't be undone.` : ""}
        confirmLabel="Remove trainer"
      />
    </div>
  );
}
