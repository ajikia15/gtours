"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  animate,
  type PanInfo,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Tour } from "@/types/Tour";
import MobileTourSearchBar from "@/components/mobile-tour-search-bar";

export type HeroClip = {
  title: string;
  region: string;
  src: string;
  poster?: string;
};

const ROTATE_MS = 10000;

export const HERO_SLUGS = [
  "shatili",
  "didgori",
  "tbilisi",
  "mtskheta",
  "manglisi",
  "beshtasheni",
  "tsalka",
  "sighnaghi",
  "sameba",
  "ushguli",
] as const;

export function useHeroClips(): HeroClip[] {
  const t = useTranslations("Hero");
  return HERO_SLUGS.map((slug) => ({
    title: t(`clips.${slug}.title`),
    region: t(`clips.${slug}.region`),
    src: `/${slug}.mp4`,
    poster: `/${slug}.jpg`,
  }));
}

interface MobileHeroProps {
  tours: Tour[];
  clips?: HeroClip[];
}

function CardMedia({ clip }: { clip: HeroClip }) {
  if (clip.poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={clip.poster}
        alt={clip.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <video
      src={`${clip.src}#t=1`}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      playsInline
      preload="metadata"
    />
  );
}

export default function MobileHero({ tours, clips: clipsProp }: MobileHeroProps) {
  const defaultClips = useHeroClips();
  const clips = clipsProp ?? defaultClips;
  const [active, setActive] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const n = clips.length;

  const heroRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const overlayOpacity = useMotionValue(1);
  const animating = useRef(false);
  const dragging = useRef(false);

  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const w = width || 1;
  const currentX = useTransform(x, [-w, 0, w], [-0.3 * w, 0, 0.3 * w]);
  const currentDim = useTransform(x, [-w, 0, w], [0.6, 1, 0.6]);
  const nextX = useTransform(x, [-w, 0, w], [0, w, 2 * w]);
  const prevX = useTransform(x, [-w, 0, w], [-2 * w, -w, 0]);

  const fade = (v: number) => (width ? 1 - Math.min(Math.abs(v) / width, 1) : 1);

  useMotionValueEvent(x, "change", (v) => {
    if (!animating.current) overlayOpacity.set(fade(v));
  });

  const spring = { type: "spring" as const, stiffness: 300, damping: 34 };

  const advance = (dir: number) => {
    animating.current = true;
    animate(overlayOpacity, 0, { duration: 0.18, ease: "easeOut" });
    animate(x, -dir * width, {
      ...spring,
      onComplete: () => {
        flushSync(() => setActive((p) => (p + dir + n) % n));
        x.set(0);
        animating.current = false;
        animate(overlayOpacity, 1, { duration: 0.28, ease: "easeOut" });
      },
    });
  };

  const go = useCallback(
    (dir: number) => {
      if (animating.current || dragging.current) return;
      if (!width) {
        setActive((p) => (p + dir + n) % n);
        return;
      }
      advance(dir);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, n, x]
  );

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => go(1), ROTATE_MS);
    return () => clearInterval(id);
  }, [n, go, resetKey]);

  const onHeroDragEnd = (_: unknown, info: PanInfo) => {
    dragging.current = false;
    setResetKey((k) => k + 1);
    const threshold = width * 0.2;
    let dir = 0;
    if (info.offset.x < -threshold || info.velocity.x < -400) dir = 1;
    else if (info.offset.x > threshold || info.velocity.x > 400) dir = -1;
    if (!dir || animating.current) {
      animate(x, 0, spring);
      return;
    }
    advance(dir);
  };

  const current = clips[active];
  const prevIdx = (active - 1 + n) % n;
  const nextIdx = (active + 1) % n;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [edges, setEdges] = useState({ left: false, right: true });

  const onPointerDown = (e: React.PointerEvent) => {
    setResetKey((k) => k + 1);
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!drag.current || !el) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };

  const endDrag = () => {
    drag.current = null;
  };

  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    updateEdges();
  }, [n]);

  useEffect(() => {
    const el = scrollerRef.current;
    const card = cardRefs.current[active];
    if (!el || !card) return;
    const delta =
      card.getBoundingClientRect().left - el.getBoundingClientRect().left - 12;
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
  }, [active]);

  const selectClip = (i: number) => {
    setResetKey((k) => k + 1);
    setActive(i);
    cardRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  return (
    <section className="relative -mt-20">
      <div
        ref={heroRef}
        className="sticky top-0 h-[100svh] overflow-hidden bg-neutral-900 text-white"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 bg-black/0"
          style={{ x: prevX }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={clips[prevIdx].poster}
            alt={clips[prevIdx].title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 z-0"
          style={{ x: currentX, opacity: currentDim }}
        >
          <video
            key={current.src}
            className="absolute inset-0 h-full w-full object-cover"
            src={current.src}
            poster={current.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-10 bg-black/0"
          style={{ x: nextX }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={clips[nextIdx].poster}
            alt={clips[nextIdx].title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,12,18,.35) 0%, rgba(9,12,18,0) 40%, rgba(9,12,18,0) 78%, rgba(9,12,18,.4) 100%)",
          }}
        />

        <motion.div
          className="pointer-events-none absolute inset-x-5 bottom-[30svh] z-20"
          style={{ opacity: overlayOpacity }}
        >
          <div className="hero-caption mb-2 flex items-center gap-2">
            <span className="text-[15px] font-bold">{current.title}</span>
            <span className="text-[13px] text-white/80">· {current.region}</span>
          </div>
          <div className="hero-progress h-[3px] w-full overflow-hidden rounded-full bg-white/30">
            <div
              key={active}
              className="h-full bg-neutral-200"
              style={{ animation: `hero-fill ${ROTATE_MS}ms linear forwards` }}
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-30"
          style={{ x }}
          drag="x"
          dragDirectionLock
          dragElastic={0.12}
          dragConstraints={{ left: -width, right: width }}
          onDragStart={() => {
            dragging.current = true;
          }}
          onDragEnd={onHeroDragEnd}
        />
      </div>

      <div
        id="hero-search-anchor"
        className="relative z-10 -mt-[28svh] scroll-mt-15 rounded-t-[28px] bg-white px-5 pt-6 pb-10 text-neutral-900 shadow-[0_-14px_30px_-20px_rgba(20,22,28,.4)]"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />

        <div className="mb-5">
          <MobileTourSearchBar tours={tours} compact />
        </div>

        <div>
          <div className="relative -mx-5">
            <div
              ref={scrollerRef}
              onScroll={updateEdges}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="no-scrollbar flex snap-x snap-mandatory scroll-pl-3 gap-3 overflow-x-auto px-3"
            >
              {clips.map((c, i) => (
                <button
                  key={`${c.title}-${i}`}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => selectClip(i)}
                  className="relative aspect-[9/16] w-[calc((100vw-3rem)/3)] shrink-0 snap-start overflow-hidden rounded-2xl bg-neutral-800"
                >
                  <CardMedia clip={c} />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-left text-[13px] font-bold text-white">
                    {c.title}
                  </span>
                  {i === active && (
                    <span className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-white" />
                  )}
                </button>
              ))}
            </div>

            <div
              className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent transition-opacity duration-200 ${
                edges.left ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${
                edges.right ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* See all — hidden for now, restore when tour listing page is ready */}
          {false && (
            <div className="mt-3 flex items-center justify-end">
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[13px] font-bold text-black underline underline-offset-4"
              >
                See all
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
