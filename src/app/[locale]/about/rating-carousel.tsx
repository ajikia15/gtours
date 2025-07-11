"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import RatingCard from "./rating-card";

type PropType = {
  options?: EmblaOptionsType;
  ratings?: Array<{
    id: string;
    title: string;
    review: string;
    author: string;
  }>;
};

export default function RatingCarousel({ options, ratings }: PropType) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Default ratings data if none provided
  const defaultRatings = [
    {
      id: "1",
      title: "Amazing Experience",
      review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, quo? This was an incredible tour that exceeded all our expectations.",
      author: "John Doe"
    },
    {
      id: "2", 
      title: "Fantastic Service",
      review: "The guides were knowledgeable and friendly. Every detail was perfectly planned and executed.",
      author: "Jane Smith"
    },
    {
      id: "3",
      title: "Unforgettable Journey",
      review: "We had such a wonderful time exploring with this company. Highly recommend to anyone!",
      author: "Mike Johnson"
    },
    {
      id: "4",
      title: "Professional Team",
      review: "From booking to the end of the tour, everything was handled professionally and with care.",
      author: "Sarah Wilson"
    },
    {
      id: "5",
      title: "Great Value",
      review: "Excellent value for money. The experience was worth every penny and more.",
      author: "David Brown"
    },
    {
      id: "6",
      title: "Best Tour Ever",
      review: "This was hands down the best tour we've ever taken. Can't wait to book another one!",
      author: "Emily Davis"
    }
  ];

  const ratingsData = ratings || defaultRatings;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {ratingsData.map((rating, index) => (
            <div
              key={rating.id}
              className="flex-[0_0_100%] min-w-0 pl-4 sm:flex-[0_0_calc(75%+3rem)] md:flex-[0_0_25%]"
            >
              <RatingCard
                title={rating.title}
                review={rating.review}
                author={rating.author}
                number={String(index + 1).padStart(2, "0")}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons - only show when necessary */}
      {!prevBtnDisabled && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}
      
      {!nextBtnDisabled && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
          onClick={scrollNext}
          disabled={nextBtnDisabled}
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </div>
  );
}
