"use client";

import { useEffect, useRef, useState } from "react";
import { Wand2, GripVertical, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Add a remix: one entry here + (if it needs styling) one CSS block in globals.css
// keyed on the `class` name. `dark` reuses the existing shadcn dark theme.
const REMIXES: { id: string; label: string; class: string }[] = [
  { id: "rounded", label: "Extra rounded", class: "remix-rounded" },
  { id: "no-progress", label: "No video progress bar", class: "remix-no-progress" },
];

const STORAGE_KEY = "remix-wizard-active";

export default function RemixWizard() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Set<string>>(new Set());
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);

  // restore saved remixes
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setActive(new Set(saved));
    } catch {
      // ignore
    }
  }, []);

  // apply active remixes to <html> + persist
  useEffect(() => {
    const html = document.documentElement;
    for (const r of REMIXES) html.classList.toggle(r.class, active.has(r.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...active]));
  }, [active]);

  if (process.env.NODE_ENV !== "development") return null;

  const startDrag = (e: React.PointerEvent) => {
    const rect = e.currentTarget.parentElement!.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    const sx = e.clientX;
    const sy = e.clientY;
    movedRef.current = false;

    const onMove = (ev: PointerEvent) => {
      if (!movedRef.current && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5)
        return;
      movedRef.current = true;
      setPos({ x: ev.clientX - dx, y: ev.clientY - dy });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const toggle = (id: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div
      className="fixed z-[100] touch-none"
      style={pos ? { left: pos.x, top: pos.y } : { left: 24, top: 24 }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {open ? (
        <div className="w-64 rounded-lg border bg-popover text-popover-foreground shadow-lg">
          <div className="flex items-center justify-between border-b px-2 py-1.5">
            <button
              onPointerDown={startDrag}
              className="flex cursor-grab items-center gap-1 text-sm font-medium active:cursor-grabbing"
            >
              <GripVertical className="size-4 text-muted-foreground" />
              Remix wizard
            </button>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="size-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {REMIXES.map((r) => (
              <label
                key={r.id}
                className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent"
              >
                {r.label}
                <Switch checked={active.has(r.id)} onCheckedChange={() => toggle(r.id)} />
              </label>
            ))}
          </div>
        </div>
      ) : (
        <button
          onPointerDown={startDrag}
          onClick={() => !movedRef.current && setOpen(true)}
          aria-label="Open remix wizard"
          className="flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-lg hover:bg-neutral-50"
        >
          <Wand2 className="size-5" />
        </button>
      )}
    </div>
  );
}
