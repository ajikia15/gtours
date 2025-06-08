"use client";

import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import geoData from "@/../public/gadm41_GEO_1.json";
import MapPinFill from "@/components/map/map-pin-fill";
import { Tour } from "@/types/Tour";
import MapTourCard from "./map-tour-card";
import TourCardSkeleton from "@/components/tour-card-skeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function InteractiveMapSection({ tours }: { tours: Tour[] }) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // ZoomableGroup state management
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([43.5, 42.3]);
  
  useEffect(() => {
    setIsMounted(true);
    setSelectedTour(tours[0]);
    setIsLoading(false);
  }, [tours]);

  function handleTourClick(tour: Tour) {
    setSelectedTour(tour);
    // Modern click-to-zoom functionality with smooth transitions - reduced zoom level
    if (tour.coordinates) {
      setCenter([tour.coordinates[1], tour.coordinates[0]]);
      setZoom(1.5); // Reduced from 2 to 1.5 for gentler zoom
    }
  }

  // Dynamic marker size - static for now, can be enhanced later
  const getMarkerSize = () => {
    return 32;
  }; // Modern zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 4)); // Reduced from 1.5 to 1.2 for gentler zoom
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5)); // Reduced from 1.5 to 1.2 for gentler zoom
  };

  const handleReset = () => {
    setCenter([43.5, 42.3]);
    setZoom(1);
  };  const [animationParent] = useAutoAnimate();

  // Prevent hydration errors by only rendering map after component mounts
  if (!isMounted) {
    return (
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 p-4 lg:p-6">
        <div className="flex-shrink-0 w-full lg:w-auto order-2 lg:order-1">
          <TourCardSkeleton key={1} />
        </div>
        <div className="flex-shrink-0 relative order-1 lg:order-2">
          <div className="w-[1200px] h-[675px] bg-gray-100 dark:bg-gray-800 border border-gray-200 rounded-xl shadow-sm animate-pulse flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">Loading map...</span>
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
          <MapTourCard
            key={selectedTour.id}
            tour={selectedTour}
            // isFavourite={false}
          />
        ) : null}
      </div>
      <div className="flex-shrink-0 relative order-1 lg:order-2">
        {/* Modern zoom controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Reset View"
          >
            ⌂
          </button>
        </div>        <ComposableMap
          className="cursor-grab active:cursor-grabbing transition-all duration-300 border border-gray-200 rounded-xl shadow-sm"
          style={{
            width: "1200px",
            height: "675px",
            transition: "all 0.3s ease-in-out",
          }}
          projectionConfig={{
            scale: 10000,
            center: [43.8, 42.1],
          }}
          width={1200}
          height={675}
        >
          {" "}
          <ZoomableGroup
            zoom={zoom}
            center={center}
            minZoom={0.5}
            maxZoom={4}
            translateExtent={[
              [-1000, -1000],
              [1000, 1000],
            ]}
          >
            <Geographies geography={geoData}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#e0e0e0"
                    stroke="#FFF"
                    strokeWidth={3}
                    style={{
                      default: {
                        outline: "none",
                        transition: "all 250ms ease-in-out",
                      },
                      hover: {
                        outline: "none",
                        fill: "#d0d0d0",
                        transition: "all 150ms ease-in-out",
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
                    size={getMarkerSize()}
                    color={selectedTour?.id === tour.id ? "#ff3333" : "#000000"}
                  />
                  {selectedTour?.id === tour.id && (
                    <circle
                      cx="0"
                      cy="0"
                      r={getMarkerSize() / 2 + 5}
                      fill="none"
                      stroke="#ff3333"
                      strokeWidth="2"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        values={`${getMarkerSize() / 2 + 5};${
                          getMarkerSize() / 2 + 10
                        };${getMarkerSize() / 2 + 5}`}
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
                  )}{" "}
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}
