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
// import { useAutoAnimate } from "@formkit/auto-animate/react";

// Default map settings
const DEFAULT_CENTER: [number, number] = [43.5, 42.3];

export default function InteractiveMapSection({ tours }: { tours: Tour[] }) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ coordinates: DEFAULT_CENTER, zoom: 1 });
  // const [animationParent] = useAutoAnimate();

  useEffect(() => {
    setIsMounted(true);
    setSelectedTour(tours[0]);
    setIsLoading(false);
  }, [tours]);  const handleTourClick = useCallback((tour: Tour) => {
    setSelectedTour(tour);
  }, []);

  const handleMoveEnd = useCallback((position: any) => {
    setPosition(position);
  }, []);
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
        {/* Tour Card */}
        {isLoading ? (
          <MapTourCardSkeleton key={1} />
        ) : selectedTour ? (
          <MapTourCard key={selectedTour.id} tour={selectedTour} />
        ) : null}{" "}        {/* Map Container */}
        <div className="order-1 lg:order-2 lg:flex-1">
          <div className="w-full aspect-[16/9] border border-gray-200 rounded-xl shadow-sm">
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
                    </g>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
      </div>
    </div>
  );
}
