"use client";

import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import geoData from "@/../public/gadm41_GEO_1.json";
import MapPinIcon from "@/components/map-pin-icon";
import { Tour } from "@/types/Tour";
import MapTourCard from "./map-tour-card";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function InteractiveMapSection() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const testMode = true;
  const [testMarkerCoords, setTestMarkerCoords] = useState<[number, number]>([
    43.5, 42.3,
  ]);
  const [copied, setCopied] = useState(false);
  const [showTestControls, setShowTestControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tours data directly in the client component
  useEffect(() => {
    async function fetchTours() {
      try {
        const response = await fetch("/api/tours");
        const data = await response.json();
        setTours(data);
        if (data.length > 0) {
          setSelectedTour(data[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setIsLoading(false);
      }
    }

    fetchTours();
  }, []);

  const handleCopyToClipboard = () => {
    const textToCopy = `${testMarkerCoords[1].toFixed(
      4
    )}, ${testMarkerCoords[0].toFixed(4)}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  const moveMarker = (direction: "up" | "down" | "left" | "right") => {
    setTestMarkerCoords((prevCoords) => {
      let newLon = prevCoords[0];
      let newLat = prevCoords[1];
      const step = 0.1;

      switch (direction) {
        case "up":
          newLat += step;
          break;
        case "down":
          newLat -= step;
          break;
        case "left":
          newLon -= step;
          break;
        case "right":
          newLon += step;
          break;
      }
      // Basic boundary check
      newLat = Math.max(-90, Math.min(90, newLat));
      newLon = Math.max(-180, Math.min(180, newLon));
      return [newLon, newLat];
    });
  };

  function handleTourClick(tour: Tour) {
    setSelectedTour(tour);
  }
  const [animationParent] = useAutoAnimate();

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading map data...</div>;
  }

  return (
    <div className="flex">
      <div className="w-1/3 h-full p-4" ref={animationParent}>
        {selectedTour ? (
          <MapTourCard key={selectedTour.id} tour={selectedTour} />
        ) : (
          <p className="text-gray-500">Click on a tour marker to see details</p>
        )}
      </div>
      <div className="w-2/3 relative">
        {testMode && (
          <div
            className={`flex flex-col items-center mt-4 absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm z-10 mr-4 border border-gray-200 dark:border-gray-700 ${
              showTestControls ? "p-4" : "p-0"
            }`}
          >
            <button
              onClick={() => setShowTestControls(!showTestControls)}
              className="p-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md w-full transition-colors duration-200"
            >
              {showTestControls ? "Hide Controls" : "Show Controls"}
            </button>
            {showTestControls && (
              <>
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750 mb-4 flex items-center w-full justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span>
                    lat: {testMarkerCoords[1].toFixed(4)}, long:
                    {testMarkerCoords[0].toFixed(4)}
                  </span>
                  <button
                    onClick={handleCopyToClipboard}
                    className="ml-2 p-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <button
                    className="p-2 text-xs bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    onClick={() => moveMarker("up")}
                  >
                    Up
                  </button>
                  <div className="flex">
                    <button
                      className="p-2 text-xs bg-gray-200 dark:bg-gray-700 rounded-md mr-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                      onClick={() => moveMarker("left")}
                    >
                      Left
                    </button>
                    <button
                      className="p-2 text-xs bg-gray-200 dark:bg-gray-700 rounded-md ml-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                      onClick={() => moveMarker("right")}
                    >
                      Right
                    </button>
                  </div>
                  <button
                    className="p-2 text-xs bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    onClick={() => moveMarker("down")}
                  >
                    Down
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        <ComposableMap
          className="w-full"
          projectionConfig={{
            scale: 8000,
            center: [43.5, 42.3],
          }}
          width={800}
          height={450}
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
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {tours.map((tour) => (
            <Marker
              key={tour.id}
              coordinates={[tour.long, tour.lat]}
              onClick={() => handleTourClick(tour)}
            >
              <MapPinIcon
                size={40}
                color={selectedTour?.id === tour.id ? "#ff3333" : "#000000"}
              />
            </Marker>
          ))}

          {testMode && showTestControls && (
            <Marker coordinates={testMarkerCoords}>
              <circle r={10} fill="#FF0000" stroke="#fff" strokeWidth={2} />
            </Marker>
          )}
        </ComposableMap>
      </div>
    </div>
  );
}
