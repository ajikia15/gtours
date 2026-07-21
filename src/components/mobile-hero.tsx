"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Tour } from "@/types/Tour";
import MobileTourSearchBar from "@/components/mobile-tour-search-bar";

export type HeroClip = {
  title: string;
  region: string;
  src: string;
  poster?: string;
};

const ROTATE_MS = 10000;

const mkClip = (title: string, region: string, slug: string): HeroClip => ({
  title,
  region,
  src: `/${slug}.mp4`,
  poster: `/${slug}.jpg`,
});

const DEFAULT_CLIPS: HeroClip[] = [
  mkClip("Shatili", "Khevsureti", "shatili"),
  mkClip("Didgori", "Kvemo Kartli", "didgori"),
  mkClip("Tbilisi", "Capital", "tbilisi"),
  mkClip("Mtskheta", "Mtskheta-Mtianeti", "mtskheta"),
  mkClip("Manglisi", "Kvemo Kartli", "manglisi"),
  mkClip("Beshtasheni", "Trialeti", "beshtasheni"),
  mkClip("Tsalka", "Trialeti", "tsalka"),
  mkClip("Sighnaghi", "Kakheti", "sighnaghi"),
];

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

export default function MobileHero({ tours, clips = DEFAULT_CLIPS }: MobileHeroProps) {
  const [active, setActive] = useState(0);
  const n = clips.length;

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => setActive((p) => (p + 1) % n), ROTATE_MS);
    return () => clearInterval(id);
  }, [n]);

  const current = clips[active];
  const upNext = [1, 2, 3].map((k) => clips[(active + k) % n]);

  return (
    <section className="relative -mt-20">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-neutral-900 text-white">
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

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,12,18,.35) 0%, rgba(9,12,18,0) 40%, rgba(9,12,18,0) 78%, rgba(9,12,18,.4) 100%)",
          }}
        />

        <div className="absolute inset-x-5 bottom-[30svh]">
          <div className="hero-caption mb-2 flex items-center gap-2">
            <span className="text-[15px] font-bold">{current.title}</span>
            <span className="text-[13px] text-white/80">· {current.region}</span>
          </div>
          <div className="hero-progress h-[3px] w-full overflow-hidden rounded-full bg-white/30">
            <div
              key={active}
              className="h-full bg-brand-secondary"
              style={{ animation: `hero-fill ${ROTATE_MS}ms linear forwards` }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-[28svh] rounded-t-[28px] bg-[#F5F5F7] px-5 pt-6 pb-10 text-neutral-900 shadow-[0_-14px_30px_-20px_rgba(20,22,28,.4)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />

        <div className="mb-5">
          <MobileTourSearchBar tours={tours} compact />
        </div>

        <div>
          <div className="grid grid-cols-3 gap-3">
            {upNext.map((c, i) => (
              <div
                key={`${c.title}-${i}`}
                className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-neutral-800"
              >
                <CardMedia clip={c} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-[13px] font-bold text-white">
                  {c.title}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-end">
            <a
              href="#"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-black underline underline-offset-4"
            >
              See all
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
