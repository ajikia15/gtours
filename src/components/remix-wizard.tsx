"use client";

import { useEffect, useRef, useState } from "react";
import { Wand2, GripVertical, X } from "lucide-react";
import { useAuth } from "@/context/auth";
import { Switch } from "@/components/ui/switch";

// Add a remix: one entry here + (if it needs styling) one CSS block in globals.css
// keyed on the `class` name. `dark` reuses the existing shadcn dark theme.
const REMIXES: { id: string; label: string; class: string }[] = [
  { id: "dark", label: "Dark mode", class: "dark" },
  { id: "rounded", label: "Extra rounded", class: "remix-rounded" },
  { id: "sharp", label: "Sharp corners", class: "remix-sharp" },
  { id: "punchy", label: "Punchy colors", class: "remix-punchy" },
];

const STORAGE_KEY = "remix-wizard-active";

export default function RemixWizard() {
  const auth = useAuth();
  const isAdmin = !!auth?.customClaims?.admin;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Set<string>>(new Set());
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
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

  useEffect(() => {
    if (!dragRef.current) return;
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      movedRef.current = true;
      setPos({ x: e.clientX - dragRef.current.dx, y: e.clientY - dragRef.current.dy });
    };
    const onUp = () => (dragRef.current = null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  });

  if (!isAdmin) return null;

  const startDrag = (e: React.PointerEvent) => {
    const rect = e.currentTarget.parentElement!.getBoundingClientRect();
    dragRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    movedRef.current = false;
    setPos({ x: rect.left, y: rect.top });
  };

  const toggle = (id: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div
      className="fixed z-[100]"
      style={pos ? { left: pos.x, top: pos.y } : { right: 24, bottom: 24 }}
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
          className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90"
        >
          <Wand2 className="size-5" />
        </button>
      )}
    </div>
  );
}
