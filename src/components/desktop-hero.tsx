"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { Tour } from "@/types/Tour";
import TourSearchBar from "@/components/tour-search-bar";
import { useHeroClips, type HeroClip } from "@/components/mobile-hero";

const ROTATE_MS = 10000;

const FAN = [
  { x: -336, y: 84, rot: -13, scale: 0.9, z: 10 },
  { x: -176, y: 48, rot: -6, scale: 0.96, z: 20 },
  { x: 0, y: 22, rot: 0, scale: 1.06, z: 30 },
  { x: 176, y: 48, rot: 6, scale: 0.96, z: 20 },
  { x: 336, y: 84, rot: 13, scale: 0.9, z: 10 },
];

const CARD_W = 248;

const WINDOW = [-2, -1, 0, 1, 2];

function FanCard({
  clip,
  pos,
  onSelect,
}: {
  clip: HeroClip;
  pos: number;
  onSelect: () => void;
}) {
  const slot = FAN[pos + 2];
  const isCurrent = pos === 0;
  const shouldLoad = pos === 0 || pos === 1;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isCurrent) v.play().catch(() => {});
    else v.pause();
  }, [isCurrent]);

  return (
    <motion.div
      className="absolute left-1/2 top-0"
      style={{ width: CARD_W, marginLeft: -CARD_W / 2, zIndex: slot.z }}
      initial={{
        x: slot.x + 60,
        y: slot.y,
        rotate: slot.rot,
        scale: slot.scale * 0.85,
        opacity: 0,
      }}
      animate={{
        x: slot.x,
        y: slot.y,
        rotate: slot.rot,
        scale: slot.scale,
        opacity: 1,
      }}
      exit={{ scale: slot.scale * 0.85, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
    >
      <div
        onClick={isCurrent ? undefined : onSelect}
        className={`rounded-[14px] bg-white p-3 shadow-[0_16px_38px_-16px_rgba(0,0,0,0.3)] ${
          isCurrent ? "" : "cursor-pointer"
        }`}
      >
        <div className="relative h-[336px] overflow-hidden rounded-[6px] bg-neutral-800">
          {clip.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clip.poster}
              alt={clip.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {shouldLoad && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={clip.src}
              poster={clip.poster}
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback"
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-500"
            style={{ opacity: isCurrent ? 0 : 0.22 }}
          />
        </div>
        <div
          className="px-1 pt-3 pb-1 transition-opacity duration-500"
          style={{ opacity: pos > 0 ? 0 : 1 }}
        >
          <div className="text-lg font-extrabold tracking-tight text-brand-primary">
            {clip.title}
          </div>
          <div className="text-sm text-neutral-500">{clip.region}</div>
        </div>
      </div>
    </motion.div>
  );
}

interface DesktopHeroProps {
  tours: Tour[];
  clips?: HeroClip[];
}

export default function DesktopHero({
  tours,
  clips: clipsProp,
}: DesktopHeroProps) {
  const t = useTranslations("Hero");
  const defaultClips = useHeroClips();
  const clips = clipsProp ?? defaultClips;
  const [active, setActive] = useState(0);
  const n = clips.length;

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => setActive((p) => p + 1), ROTATE_MS);
    return () => clearInterval(id);
  }, [n, active]);

  return (
    <div className="mx-auto max-w-[1440px] px-8 pt-12 pb-8">
      <h1 className="mb-4 text-center text-[52px] font-extrabold leading-none tracking-tight text-brand-primary">
        {t.rich("headline", {
          accent: (chunks) => (
            <span className="text-brand-secondary">{chunks}</span>
          ),
        })}
      </h1>

      <div className="relative mx-auto h-[560px]" style={{ perspective: 1200 }}>
        <AnimatePresence initial={false}>
          {WINDOW.map((p) => {
            const seq = active + p;
            const clip = clips[((seq % n) + n) % n];
            return (
              <FanCard
                key={seq}
                clip={clip}
                pos={p}
                onSelect={() => setActive(seq)}
              />
            );
          })}
        </AnimatePresence>
      </div>

      <TourSearchBar tours={tours} compact />
    </div>
  );
}
