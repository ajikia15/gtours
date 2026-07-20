"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { Tour } from "@/types/Tour";
import TourSearchBar from "@/components/tour-search-bar";
import type { HeroClip } from "@/components/mobile-hero";

const ROTATE_MS = 5000;

const PLACEHOLDER = "/sighnaghi.mp4";

const DEFAULT_CLIPS: HeroClip[] = [
  { title: "Kazbegi", region: "Mtskheta-Mtianeti", src: PLACEHOLDER },
  { title: "Svaneti", region: "Upper Svaneti", src: PLACEHOLDER },
  { title: "Batumi", region: "Adjara", src: PLACEHOLDER },
  { title: "Kakheti", region: "Wine Country", src: PLACEHOLDER },
  { title: "Tbilisi", region: "Capital", src: PLACEHOLDER },
  { title: "Racha", region: "Highlands", src: PLACEHOLDER },
];

function ClipStack({
  clips,
  activeIndex,
  play,
}: {
  clips: HeroClip[];
  activeIndex: number;
  play: boolean;
}) {
  return (
    <>
      {clips.map((c, i) =>
        play ? (
          <video
            key={i}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              i === activeIndex ? "opacity-100" : "opacity-0",
            )}
            src={c.src}
            poster={c.poster}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <video
            key={i}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              i === activeIndex ? "opacity-100" : "opacity-0",
            )}
            src={c.poster ? undefined : `${c.src}#t=1`}
            poster={c.poster}
            muted
            playsInline
            preload="metadata"
          />
        ),
      )}
    </>
  );
}

interface DesktopHeroProps {
  tours: Tour[];
  clips?: HeroClip[];
}

export default function DesktopHero({
  tours,
  clips = DEFAULT_CLIPS,
}: DesktopHeroProps) {
  const [active, setActive] = useState(0);
  const n = clips.length;

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => setActive((p) => (p + 1) % n), ROTATE_MS);
    return () => clearInterval(id);
  }, [n]);

  const current = clips[active];
  const topIndex = (active + 1) % n;
  const botIndex = (active + 2) % n;

  return (
    <div>
      <section className="mx-auto flex max-w-[1440px] flex-wrap items-center">
        <div className="min-w-0 flex-1 basis-[440px] px-10 py-16 lg:pl-16">
          <h1 className="mb-6 text-[52px] lg:text-[68px] font-extrabold leading-none tracking-tight text-brand-primary">
            Explore Georgia,
            <br />
            your way.
          </h1>
          <p className="mb-9 max-w-[440px] text-lg leading-relaxed text-neutral-600 text-pretty">
            From Tbilisi&apos;s old town to Kakheti&apos;s vineyards and the
            Black Sea coast — browse our guided tours, pick your dates, and book
            online in minutes.
          </p>
          <div className="mb-12 flex gap-3.5">
            <Link
              href="/destinations"
              className="rounded-full bg-brand-secondary px-8 py-4 text-base font-bold text-white hover:bg-brand-secondary/90"
            >
              Browse tours
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-brand-primary px-7 py-4 text-base font-semibold text-brand-primary hover:bg-brand-primary/5"
            >
              Talk to us
            </Link>
          </div>
        </div>

        <div className="flex flex-1 basis-[480px] flex-wrap justify-center gap-4 px-10 py-14">
          <div className="relative h-[540px] w-[304px] overflow-hidden rounded-[18px] bg-neutral-900">
            <ClipStack clips={clips} activeIndex={active} play />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-[18px] bottom-[18px] z-[5] text-white">
              <div className="text-[28px] font-extrabold tracking-tight">
                {current.title}
              </div>
              <div className="mb-3 text-[13px] text-white/80">
                {current.region}
              </div>
              <div className="h-[3px] overflow-hidden rounded-full bg-white/30">
                <div
                  key={active}
                  className="h-full bg-brand-secondary"
                  style={{
                    animation: `hero-fill ${ROTATE_MS}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex h-[540px] flex-col justify-between">
            {[topIndex, botIndex].map((idx, slot) => (
              <div
                key={slot}
                className="relative h-[262px] w-[262px] overflow-hidden rounded-[14px] bg-neutral-900"
              >
                <ClipStack clips={clips} activeIndex={idx} play={false} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute inset-x-3 bottom-3 z-[5] text-[15px] font-bold text-white">
                  {clips[idx].title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px]">
        <TourSearchBar tours={tours} compact />
      </div>
    </div>
  );
}
