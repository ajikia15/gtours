"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelpers";

type MobileImageSectionProps = {
  images: string[] | undefined;
  tourTitle: string;
  className?: string;
};

export const MobileImageSection: React.FC<MobileImageSectionProps> = ({
  images,
  tourTitle,
  className = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [prevBtnVisible, setPrevBtnVisible] = useState(false);
  const [nextBtnVisible, setNextBtnVisible] = useState(true);

  const options: EmblaOptionsType = {
    align: "center",
    loop: true,
    skipSnaps: false,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnVisible(emblaApi.canScrollPrev());
    setNextBtnVisible(emblaApi.canScrollNext());
  }, [emblaApi]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onInit();
    onSelect();
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onInit);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  // If no images or only one image, show single image
  const displayImages = images && images.length > 0 ? images : [undefined];
  const showNavigation = displayImages.length > 1;

  return (
    <div className={`w-full h-[40vh] relative ${className}`}>
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {displayImages.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
              <Image
                src={getImageUrl(image)}
                alt={`${tourTitle} - Image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Navigation Arrows */}
      {showNavigation && prevBtnVisible && (
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white/90 transition-all duration-200"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 text-gray-800" />
        </button>
      )}
      {showNavigation && nextBtnVisible && (
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white/90 transition-all duration-200"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 text-gray-800" />
        </button>
      )}{" "}
      {/* Bottom overlay with thin bars */}
      <div className="absolute bottom-0 inset-x-0 bg-white h-6 rounded-t-4xl z-10 flex justify-center items-center w-full">
        {showNavigation ? (
          <div className="flex space-x-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-0.5 transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-gray-800 w-8"
                    : "bg-gray-400 hover:bg-gray-600 w-6"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex space-x-2">
            <div className="h-0.5 w-6 bg-gray-400" />
            <div className="h-0.5 w-6 bg-gray-400" />
            <div className="h-0.5 w-6 bg-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};
