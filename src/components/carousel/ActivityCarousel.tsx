"use client";
import React, { useCallback, useEffect, useState, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ActivityCarouselProps = {
  children: ReactNode;
  className?: string;
};

export const ActivityCarousel: React.FC<ActivityCarouselProps> = ({
  children,
  className,
}) => {
  const [prevBtnVisible, setPrevBtnVisible] = useState(false);
  const [nextBtnVisible, setNextBtnVisible] = useState(true);

  const options: EmblaOptionsType = {
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnVisible(emblaApi.canScrollPrev());
    setNextBtnVisible(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div
      className={`relative shadow-md border border-gray-200 rounded-xl ${
        className || ""
      }`}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">{children}</div>
      </div>

      {prevBtnVisible && (
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-0.5 sm:p-1 shadow-md"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        </button>
      )}

      {nextBtnVisible && (
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-0.5 sm:p-1 shadow-md"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};
