import React, { useMemo, useState, useEffect } from "react";
import { Plus, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import Badge from "../components/Badge";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import { SearchInput, Select, Field, Input } from "../components/FormControls";
import { Modal, ConfirmDialog } from "../components/Overlay";
import { useToast } from "../context/ToastContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useDebounce } from "../hooks/useDebounce";
import { MEMBERSHIP_PLANS } from "../data/mockData";
import { membersApi } from "../services/api";

const emptyForm = { name: "", email: "", phone: "", plan: "Standard", status: "active", password: "" };

export default function Members() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // search stays local state so every keystroke updates the input instantly...
  const [search, setSearch] = useState("");
  // ...but filtering runs against the debounced value, so the table only
  // re-filters ~300ms after the user stops typing instead of on every key.
  const debouncedSearch = useDebounce(search, 300);

  // Filter preferences are persisted with the useLocalStorage custom hook,
  // so if staff filter down to e.g. "suspended" members and refresh the
  // page, that filter is still applied when they come back.
  const [statusFilter, setStatusFilter] = useLocalStorage("members:statusFilter", "all");
  const [planFilter, setPlanFilter] = useLocalStorage("members:planFilter", "all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      setIsLoading(true);
      const res = await membersApi.list();
      const mappedMembers = (res.data || []).map((m) => ({
        _id: m._id,
        id: m.memberId,
        name: m.name,
        email: m.email,
        phone: m.phone,
        plan: m.membershipPlan,
        status: m.status,
        joined: new Date(m.joinDate).toISOString().split("T")[0],
        expiry: "N/A", // Not stored in DB
        payment_status: "paid", // Fallback for UI
      }));
      setMembers(mappedMembers);
    } catch (err) {
      console.error("Failed to fetch members:", err);
      showToast(err.message || "Failed to load members", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      const matchesPlan = planFilter === "all" || m.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [members, debouncedSearch, statusFilter, planFilter]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(m) {
    setEditing(m);
    setForm({ name: m.name, email: m.email, phone: m.phone, plan: m.plan, status: m.status, password: "" });
    setFormOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      membershipPlan: form.plan,
      status: form.status,
      ...(form.password && { password: form.password })
    };

    try {
      if (editing) {
        await membersApi.update(editing._id, payload);
        showToast(`${form.name}'s profile was updated`, "success");
      } else {
        // Provide a generated memberId since backend requires it
        payload.memberId = `MEM-${Math.floor(1000 + Math.random() * 9000)}`;
        await membersApi.create(payload);
        showToast(`${form.name} added as a new member`, "success");
      }
      setFormOpen(false);
      fetchMembers(); // refresh from backend
    } catch (err) {
      console.error("Failed to save member:", err);
      showToast(err.message || "Failed to save member", "error");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await membersApi.remove(deleting._id);
      showToast(`${deleting.name} was removed`, "info");
      setDeleting(null);
      fetchMembers();
    } catch (err) {
      console.error("Failed to delete member:", err);
      showToast(err.message || "Failed to delete member", "error");
    }
  }

  const columns = [
    {
      key: "name",
      label: "Member",
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-white/70">
            {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{m.name}</p>
            <p className="truncate text-xs text-white/40">{m.id}</p>
          </div>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (m) => <span className="text-white/60">{m.email}</span> },
    { key: "phone", label: "Phone", render: (m) => <span className="text-white/60">{m.phone}</span> },
    { key: "plan", label: "Plan", sortable: true, render: (m) => <span className="text-white/60">{m.plan}</span> },
    { key: "joined", label: "Joined", sortable: true, render: (m) => <span className="text-white/60">{m.joined}</span> },
    { key: "expiry", label: "Expiry", sortable: true, render: (m) => <span className="text-white/60">{m.expiry}</span> },
    { key: "payment_status", label: "Payment", render: (m) => <Badge status={m.payment_status} /> },
    { key: "status", label: "Status", sortable: true, render: (m) => <Badge status={m.status} /> },
    {
      key: "actions",
      label: "",
      render: (m) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => setViewing(m)} aria-label={`View ${m.name}`} className="flex h-7 w-7 items-center justify-center rounded-full text-white/40 hover:bg-white/5 hover:text-white">
            <Eye size={14} />
          </button>
          <button onClick={() => openEdit(m)} aria-label={`Edit ${m.name}`} className="flex h-7 w-7 items-center justify-center rounded-full text-white/40 hover:bg-white/5 hover:text-white">
            <Pencil size={14} />
          </button>
          <button onClick={() => setDeleting(m)} aria-label={`Delete ${m.name}`} className="flex h-7 w-7 items-center justify-center rounded-full text-white/40 hover:bg-alert/10 hover:text-[#FF8A66]">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/70">
              All members ({filtered.length})
            </h2>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email…" className="sm:w-56" />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </Select>
            <Select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
              <option value="all">All plans</option>
              {MEMBERSHIP_PLANS.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </Select>
            <Button icon={Plus} onClick={openAdd} className="shrink-0">
              Add Member
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-white/50">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Loading members...</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={filtered}
              pageSize={7}
              emptyTitle="No members match your filters"
              emptyDescription="Try adjusting your search or filter criteria."
            />
          )}
        </div>
      </div>

      {/* Add / edit form */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit member" : "Add member"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save changes" : "Add member"}</Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-3">
          <Field label="Full name" id="m-name" error={!form.name.trim() ? "" : undefined}>
            <Input id="m-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Arjun Verma" />
          </Field>
          <Field label="Email" id="m-email">
            <Input id="m-email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="name@mail.com" />
          </Field>
          <Field label="Phone" id="m-phone">
            <Input id="m-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 90000 00000" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Plan" id="m-plan">
              <Select id="m-plan" className="w-full rounded-lg py-2" value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}>
                {MEMBERSHIP_PLANS.map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status" id="m-status">
              <Select id="m-status" className="w-full rounded-lg py-2" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </Select>
            </Field>
          </div>
          {!editing && (
            <Field label="Password (for login)" id="m-pwd">
              <Input id="m-pwd" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Set a password" />
            </Field>
          )}
        </form>
      </Modal>

      {/* View details */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Member details">
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
                ["Email", viewing.email],
                ["Phone", viewing.phone],
                ["Plan", viewing.plan],
                ["Joined", viewing.joined],
                ["Expiry", viewing.expiry],
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
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-white/35">Payment</dt>
                <dd className="mt-1"><Badge status={viewing.payment_status} /></dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Remove member"
        description={deleting ? `This will permanently remove ${deleting.name} and their membership history. This can't be undone.` : ""}
        confirmLabel="Remove member"
      />
    </div>
  );
}
