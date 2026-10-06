import React, { useState } from "react";
import { Clock, User2 } from "lucide-react";
import { ChartCard, TabGroup } from "../../components/Cards";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import { EmptyState } from "../../components/Overlay";
import { useToast } from "../../context/ToastContext";
import { CLASSES, MY_BOOKED_CLASS_IDS } from "../../data/mockData";

const DATES = [...new Set(CLASSES.map((c) => c.date))];

export default function BookClasses() {
  const { showToast } = useToast();
  const [activeDate, setActiveDate] = useState(DATES[0]);
  const [booked, setBooked] = useState(new Set(MY_BOOKED_CLASS_IDS));

  const dayClasses = CLASSES.filter((c) => c.date === activeDate);

  function toggleBooking(cls) {
    setBooked((prev) => {
      const next = new Set(prev);
      if (next.has(cls.id)) {
        next.delete(cls.id);
        showToast(`Booking cancelled for ${cls.name}.`, "info");
      } else {
        if (cls.status === "full") {
          showToast(`${cls.name} is full — try another slot.`, "error");
          return prev;
        }
        next.add(cls.id);
        showToast(`You're booked into ${cls.name}.`, "success");
      }
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <ChartCard
        title="Class schedule"
        actions={
          <TabGroup
            options={DATES.map((d) => ({ id: d, label: d.slice(5) }))}
            active={activeDate}
            onChange={setActiveDate}
          />
        }
      >
        {dayClasses.length === 0 ? (
          <EmptyState title="No classes scheduled" description="Check another date." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {dayClasses.map((cls) => {
              const isBooked = booked.has(cls.id);
              const isFull = cls.status === "full" && !isBooked;
              return (
                <div key={cls.id} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{cls.name}</p>
                    <Badge status={isBooked ? "checked_in" : cls.status}>{isBooked ? "booked" : cls.status}</Badge>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-white/45">
                    <Clock size={12} /> {cls.time}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
                    <User2 size={12} /> {cls.trainer}
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    {cls.enrolled}/{cls.capacity} enrolled
                  </p>
                  <Button
                    variant={isBooked ? "danger" : "secondary"}
                    disabled={isFull || cls.status === "cancelled"}
                    className="mt-4 w-full"
                    onClick={() => toggleBooking(cls)}
                  >
                    {cls.status === "cancelled" ? "Cancelled" : isBooked ? "Cancel booking" : isFull ? "Full" : "Book class"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
