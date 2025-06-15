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
import MapTourCardSkeleton from "@/components/map-tour-card-skeleton";
// import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useResponsive } from "@/hooks/use-responsive";

// Default map settings
const DEFAULT_CENTER: [number, number] = [43.5, 42.3];

export default function InteractiveMapSection({ tours }: { tours: Tour[] }) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  // const [animationParent] = useAutoAnimate();
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    setIsMounted(true);
    setSelectedTour(tours[0]);
    setIsLoading(false);
  }, [tours]);

  const handleTourClick = useCallback((tour: Tour) => {
    setSelectedTour(tour);
  }, []); // Use fixed dimensions for the SVG, but make container responsive
  const mapWidth = 1200;
  const mapHeight = 675;
  // Calculate responsive projection scale
  const getProjectionScale = () => {
    if (isMobile) {
      return 8000; // Zoom out more on mobile
    } else if (isTablet) {
      return 9000; // Medium zoom on tablet
    } else {
      return 10000; // Original scale on desktop
    }
  };

  // Calculate responsive marker size
  const getMarkerSize = () => {
    if (isMobile) {
      return 24; // Smaller on mobile for easier touch
    } else if (isTablet) {
      return 28; // Medium size on tablet
    } else {
      return 32; // Original size on desktop
    }
  };

  // Calculate responsive pulse circle radius
  const getPulseRadius = () => {
    const markerSize = getMarkerSize();
    return Math.round(markerSize * 0.65); // Proportional to marker size
  };
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-6">
        {" "}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12 items-start lg:items-center">
          {/* Tour Card */}
          <MapTourCardSkeleton key={1} />

          {/* Map Container */}
          <div className="order-1 lg:order-2 lg:flex-1">
            <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 border border-gray-200 rounded-xl shadow-sm animate-pulse flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Loading map...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12 items-start lg:items-center">
        {" "}
        {/* Tour Card */}
        {isLoading ? (
          <MapTourCardSkeleton key={1} />
        ) : selectedTour ? (
          <MapTourCard key={selectedTour.id} tour={selectedTour} />
        ) : null}
        {/* Map Container */}
        <div className="order-1 lg:order-2 lg:flex-1">
          <div className="w-full aspect-[16/9] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <ComposableMap
              className={`w-full h-full ${
                isMobile
                  ? "touch-pan-x touch-pan-y cursor-pointer"
                  : "cursor-grab active:cursor-grabbing"
              }`}
              projectionConfig={{
                scale: getProjectionScale(),
                center: DEFAULT_CENTER,
              }}
              width={mapWidth}
              height={mapHeight}
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
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
              {tours.map((tour) => {
                const markerSize = getMarkerSize();
                const pulseRadius = getPulseRadius();
                const pulseRadiusMax = pulseRadius + 5;

                return (
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
                        size={markerSize}
                        color={
                          selectedTour?.id === tour.id ? "#ff3333" : "#000000"
                        }
                      />
                      {selectedTour?.id === tour.id && (
                        <circle
                          cx="0"
                          cy="0"
                          r={pulseRadius}
                          fill="none"
                          stroke="#ff3333"
                          strokeWidth="2"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="r"
                            values={`${pulseRadius};${pulseRadiusMax};${pulseRadius}`}
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
                );
              })}
            </ComposableMap>
          </div>
        </div>
      </div>
    </div>
  );
}
