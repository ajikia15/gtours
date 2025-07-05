"use client";

import { useState, useEffect, useCallback } from "react";
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
import MapTourCardSkeleton from "@/components/map-tour-card-skeleton";
import MapTourCardMobile from "./map-tour-card-mobile";
import { isMobile } from "@/lib/isMobile";
// import { useAutoAnimate } from "@formkit/auto-animate/react";

// Default map settings
const DEFAULT_CENTER: [number, number] = [43.5, 42.3];

export default function InteractiveMapSection({ tours }: { tours: Tour[] }) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({
    coordinates: DEFAULT_CENTER,
    zoom: 1,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobile, setMobile] = useState(false);
  // const [animationParent] = useAutoAnimate();

  useEffect(() => {
    setIsMounted(true);
    setSelectedTour(tours[0]);
    setIsLoading(false);
    // Check if device is mobile and set zoom accordingly
    const userAgent = navigator.userAgent || "";
    const isMobileDevice = isMobile(userAgent);
    setMobile(isMobileDevice);

    if (isMobileDevice) {
      setPosition((prev) => ({
        ...prev,
        zoom: 1.5,
      }));
    }
  }, [tours]);

  const handleTourClick = useCallback((tour: Tour) => {
    setSelectedTour(tour);
    // Pan to the selected tour's coordinates with animation
    if (tour.coordinates && tour.coordinates.length >= 2) {
      setIsAnimating(true);
      setPosition((prev) => ({
        ...prev,
        coordinates: [tour.coordinates![1], tour.coordinates![0]],
      })); // Remove animation after transition completes
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, []);
  const handleMoveEnd = useCallback((position: any) => {
    setPosition(position);
    // Ensure animation flag is off when user drags
    setIsAnimating(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.5, 8),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.5, 0.5),
    }));
  }, []);
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 ">
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
    <div className="container mx-auto px-4 ">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12 items-start lg:items-center">
        {/* Tour Card */}
        {!mobile && (
          <>
            {isLoading ? (
              <MapTourCardSkeleton key={1} />
            ) : selectedTour ? (
              <MapTourCard key={selectedTour.id} tour={selectedTour} />
            ) : null}
          </>
        )}
        {/* Map Container */}
        <div className="order-1 lg:order-2 lg:flex-1 relative">
          <div
            className={`w-full rounded-xl  ${
              mobile ? "h-[70vh] min-h-[500px]" : "aspect-[16/9]"
            }`}
          >
            <ComposableMap
              projectionConfig={{
                scale: 12000, // Zoomed in more
                center: DEFAULT_CENTER,
              }}
              width={800}
              height={450}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={handleMoveEnd}
                style={
                  isAnimating
                    ? {
                        transition: "transform 0.4s ease-in-out",
                      }
                    : {}
                }
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
                        size={28}
                        color={
                          selectedTour?.id === tour.id ? "#ff3333" : "#000000"
                        }
                      />
                      {/* Mobile popup at marker location */}
                      {mobile && selectedTour?.id === tour.id && (
                        <foreignObject x="20" y="-100" width="280" height="120">
                          <MapTourCardMobile tour={tour} />
                        </foreignObject>
                      )}
                    </g>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center font-bold text-lg"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center font-bold text-lg"
              aria-label="Zoom out"
            >
              −
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
