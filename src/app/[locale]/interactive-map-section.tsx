"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import geoData from "@/../public/gadm41_GEO_1.json";
import MapPinFill from "@/components/map/map-pin-fill";
import { Tour } from "@/types/Tour";
import MapTourCard from "./map-tour-card";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// Default map settings
const DEFAULT_CENTER: [number, number] = [43.5, 42.3];

export default function InteractiveMapSection({ tours }: { tours: Tour[] }) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    setIsMounted(true);
    setSelectedTour(tours[0]);
    setIsLoading(false);
  }, [tours]);

  const handleTourClick = useCallback((tour: Tour) => {
    setSelectedTour(tour);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 p-4 lg:p-6">
        <div className="flex-shrink-0 w-full lg:w-auto order-2 lg:order-1">
          <TourCardSkeleton key={1} />
        </div>
        <div className="flex-shrink-0 relative order-1 lg:order-2">
          <div className="w-[1200px] h-[675px] bg-gray-100 dark:bg-gray-800 border border-gray-200 rounded-xl shadow-sm animate-pulse flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">
              Loading map...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 p-4 lg:p-6">
      <div
        className="flex-shrink-0 w-full lg:w-auto order-2 lg:order-1"
        ref={animationParent}
      >
        {isLoading ? (
          <TourCardSkeleton key={1} />
        ) : selectedTour ? (
          <MapTourCard key={selectedTour.id} tour={selectedTour} />
        ) : null}
      </div>
      <div className="flex-shrink-0 relative order-1 lg:order-2">
        <ComposableMap
          className="cursor-grab active:cursor-grabbing border border-gray-200 rounded-xl shadow-sm"
          style={{
            width: "1200px",
            height: "675px",
          }}
          projectionConfig={{
            scale: 10000,
            center: DEFAULT_CENTER,
          }}
          width={1200}
          height={675}
        >
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e0e0e0"
                  stroke="#FFF"
                  strokeWidth={3}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      outline: "none",
                      fill: "#d0d0d0",
                    },
                    pressed: {
                      outline: "none",
                      fill: "#c0c0c0",
                    },
                  }}
                />
              ))
            }
          </Geographies>
          {tours.map((tour) => (
            <Marker
              key={tour.id}
              coordinates={
                tour.coordinates
                  ? [tour.coordinates[1], tour.coordinates[0]]
                  : [0, 0]
              }
              onClick={() => handleTourClick(tour)}
            >
              <g className="marker-group" style={{ cursor: "pointer" }}>
                <MapPinFill
                  size={32}
                  color={selectedTour?.id === tour.id ? "#ff3333" : "#000000"}
                />
                {selectedTour?.id === tour.id && (
                  <circle
                    cx="0"
                    cy="0"
                    r={21}
                    fill="none"
                    stroke="#ff3333"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      values="21;26;21"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0.2;0.6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}
