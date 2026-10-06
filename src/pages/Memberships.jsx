import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, Loader2 } from "lucide-react";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { Modal, ConfirmDialog } from "../components/Overlay";
import { Field, Input, Select } from "../components/FormControls";
import { useToast } from "../context/ToastContext";
import { membershipsApi } from "../services/api";

const emptyForm = { name: "", price: "", duration: "1 month", features: "" };

export default function Memberships() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMemberships();
  }, []);

  async function fetchMemberships() {
    try {
      setIsLoading(true);
      const res = await membershipsApi.list();
      const mappedPlans = (res.data || []).map((p) => ({
        _id: p._id,
        id: p.planId,
        name: p.planName,
        duration: p.duration,
        price: p.price,
        features: p.description ? p.description.split(",").map((f) => f.trim()) : [],
        active_members: 0,
        status: p.status,
      }));
      setPlans(mappedPlans);
    } catch (err) {
      console.error("Failed to fetch memberships:", err);
      showToast(err.message || "Failed to load memberships", "error");
    } finally {
      setIsLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({ name: p.name, price: p.price, duration: p.duration, features: p.features.join(", ") });
    setFormOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    
    const payload = {
      planName: form.name,
      price: Number(form.price),
      duration: form.duration,
      description: form.features.split(",").map((f) => f.trim()).filter(Boolean).join(", "),
      status: "active",
    };

    try {
      if (editing) {
        await membershipsApi.update(editing._id, payload);
        showToast(`${form.name} plan updated`, "success");
      } else {
        payload.planId = `plan_${Date.now()}`;
        await membershipsApi.create(payload);
        showToast(`${form.name} plan created`, "success");
      }
      setFormOpen(false);
      fetchMemberships();
    } catch (err) {
      console.error("Failed to save membership:", err);
      showToast(err.message || "Failed to save membership", "error");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await membershipsApi.remove(deleting._id);
      showToast(`${deleting.name} plan deleted`, "info");
      setDeleting(null);
      fetchMemberships();
    } catch (err) {
      console.error("Failed to delete membership:", err);
      showToast(err.message || "Failed to delete membership", "error");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/45">{plans.length} active plans</p>
        <Button icon={Plus} onClick={openAdd}>
          Add Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-white/50">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Loading membership plans...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border border-white/10 bg-surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                  <p className="text-xs text-white/40">{p.duration}</p>
                </div>
                <Badge status={p.status} />
              </div>
              <p className="mt-4 font-mono text-3xl text-volt">
                ₹{p.price.toLocaleString("en-IN")}
                <span className="ml-1 text-sm font-sans text-white/40">/{p.duration.split(" ")[1] || "term"}</span>
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/65">
                    <Check size={14} className="mt-0.5 shrink-0 text-volt" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-white/40">{p.active_members} active members</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" icon={Pencil} onClick={() => openEdit(p)} className="flex-1">
                  Edit
                </Button>
                <Button variant="danger" icon={Trash2} onClick={() => setDeleting(p)} className="flex-1">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit plan" : "New membership plan"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save changes" : "Create plan"}</Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-3">
          <Field label="Plan name" id="p-name">
            <Input id="p-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Gold" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (₹)" id="p-price">
              <Input id="p-price" type="number" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="1999" />
            </Field>
            <Field label="Duration" id="p-duration">
              <Select id="p-duration" className="w-full rounded-lg py-2" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}>
                <option>1 month</option>
                <option>3 months</option>
                <option>6 months</option>
                <option>12 months</option>
              </Select>
            </Field>
          </div>
          <Field label="Features" id="p-features" hint="Comma-separated list">
            <Input id="p-features" value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} placeholder="Gym floor access, 2 classes/week" />
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete plan"
        description={deleting ? `Members currently on the ${deleting.name} plan will keep their access until renewal, but new sign-ups won't be able to choose it.` : ""}
        confirmLabel="Delete plan"
      />
    </div>
  );
}
