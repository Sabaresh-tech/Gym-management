import React, { useState } from "react";
import { Clock, Wallet, UserPlus, ClipboardCheck, Wrench, Check } from "lucide-react";
import Button from "../components/Button";
import { EmptyState } from "../components/Overlay";
import { useToast } from "../context/ToastContext";
import { NOTIFICATIONS as INITIAL } from "../data/mockData";

const TYPE_META = {
  expiry: { icon: Clock, color: "text-amber-300", bg: "bg-amber-400/15" },
  payment: { icon: Wallet, color: "text-[#FF8A66]", bg: "bg-alert/15" },
  member: { icon: UserPlus, color: "text-volt", bg: "bg-volt/15" },
  attendance: { icon: ClipboardCheck, color: "text-sky-300", bg: "bg-sky-400/15" },
  equipment: { icon: Wrench, color: "text-white/60", bg: "bg-white/10" },
};

export default function Notifications() {
  const [items, setItems] = useState(INITIAL);
  const { showToast } = useToast();

  function dismiss(id) {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }

  function clearAll() {
    setItems([]);
    showToast("All notifications cleared", "info");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/45">{items.length} notifications</p>
        {items.length > 0 && (
          <Button variant="secondary" onClick={clearAll}>Clear all</Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState title="You're all caught up" description="New alerts about memberships, payments and equipment will show up here." />
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const meta = TYPE_META[n.type];
            const Icon = meta.icon;
            return (
              <div key={n.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-surface p-4">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.color}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  <p className="mt-0.5 text-xs text-white/45">{n.detail}</p>
                  <p className="mt-1 text-[11px] text-white/30">{n.time}</p>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  aria-label="Mark as read"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/30 hover:bg-white/5 hover:text-volt"
                >
                  <Check size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
