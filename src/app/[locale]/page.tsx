import QuickCategory from "@/components/carousel/QuickCategory";
import { getTranslations } from "next-intl/server";
import DisplayCardsSection from "./display-cards-section";
import { Suspense } from "react";
import { getTours } from "@/data/tours";
import InteractiveMapSection from "./interactive-map-section";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import MobileHero from "@/components/mobile-hero";
import DesktopHero from "@/components/desktop-hero";
import ContactSection from "@/components/contact-section";

export default async function HomePage() {
  const t = await getTranslations("Homepage");

  return (
    <div className="mb-6 md:mb-12">
      {/* Mobile Hero - full-bleed rotating clips + search */}
      <div className="md:hidden">
        <Suspense fallback={<div className="-mt-20 h-[100svh] bg-neutral-900" />}>
          <MobileHeroWithData />
        </Suspense>
      </div>

      {/* Desktop Hero - editorial copy + promotion rotation + search band */}
      <div className="hidden md:block">
        <Suspense fallback={<DesktopHeroSkeleton />}>
          <DesktopHeroWithData />
        </Suspense>
      </div>

      <div className="space-y-6 md:space-y-16 mt-6 md:mt-16">
        <div id="popular-tours">
          <h1 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold">
            {t("popular-tours")}
          </h1>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <TourCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            }
          >
            <DisplayCardsSection />
          </Suspense>
        </div>

        <div>
          <h1 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold">
            {t("activities")}
          </h1>
          <QuickCategory />
        </div>

        <div>
          <h1 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold">
            {t("discover-georgia")}
          </h1>
          <Suspense
            fallback={
              <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
            }
          >
            <MapWithData />
          </Suspense>
        </div>

        {/* Contact Section */}
        <div>
          <h1 className="text-center mb-4 md:mb-6 text-xl md:text-2xl font-bold">
            {t("contact-us")}
          </h1>
          <Suspense
            fallback={
              <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
            }
          >
            <ContactSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function DesktopHeroSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-8 pt-12 pb-8">
      <div className="mx-auto mb-4 h-[52px] w-[560px] max-w-full animate-pulse rounded-lg bg-neutral-200" />
      <div className="relative mx-auto h-[560px]">
        {[
          { x: -336, y: 84, rot: -13, scale: 0.9, z: 10 },
          { x: -176, y: 48, rot: -6, scale: 0.96, z: 20 },
          { x: 0, y: 22, rot: 0, scale: 1.06, z: 30 },
          { x: 176, y: 48, rot: 6, scale: 0.96, z: 20 },
          { x: 336, y: 84, rot: 13, scale: 0.9, z: 10 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0 w-[248px]"
            style={{
              marginLeft: -124,
              zIndex: s.z,
              transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg) scale(${s.scale})`,
            }}
          >
            <div className="rounded-[14px] bg-white p-3 shadow-[0_16px_38px_-16px_rgba(0,0,0,0.3)]">
              <div className="h-[336px] animate-pulse rounded-[6px] bg-neutral-200" />
              {s.x === 0 && (
                <div className="px-1 pt-3 pb-1">
                  <div className="mb-2 h-5 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto h-16 w-full animate-pulse rounded-xl bg-neutral-200" />
    </div>
  );
}

async function MobileHeroWithData() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 },
  });

  return <MobileHero tours={tours} />;
}

async function DesktopHeroWithData() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 },
  });

  return <DesktopHero tours={tours} />;
}

async function MapWithData() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 20 },
  });

  return <InteractiveMapSection tours={tours} />;
}
