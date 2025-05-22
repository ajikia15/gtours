"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import geoData from "@/../public/gadm41_GEO_1.json";
import { MapPin } from "lucide-react";
import { Tour } from "@/types/Tour";
import MapTourCard from "./map-tour-card";
import { useAutoAnimate } from "@formkit/auto-animate/react";
export default function InteractiveMapSection({ tours }: { tours: Tour[] }) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(
    tours[0] || null
  );
  const testMode = true;
  const [testMarkerCoords, setTestMarkerCoords] = useState<[number, number]>([
    43.5, 42.3,
  ]);
  const [copied, setCopied] = useState(false);
  const [showTestControls, setShowTestControls] = useState(true);

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
      // Basic boundary check (optional, depending on desired behavior)
      newLat = Math.max(-90, Math.min(90, newLat));
      newLon = Math.max(-180, Math.min(180, newLon));
      return [newLon, newLat];
    });
  };
  function handleTourClick(tour: Tour) {
    setSelectedTour(tour);
  }
  const [animationParent] = useAutoAnimate();

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
          <div className="flex flex-col items-center mt-4 absolute top-0 right-0 bg-gray-50 p-2 rounded shadow">
            <button
              onClick={() => setShowTestControls(!showTestControls)}
              className="mb-2 p-1 text-xs bg-gray-300 hover:bg-gray-400 rounded-sm w-full"
            >
              {showTestControls ? "Hide Controls" : "Show Controls"}
            </button>
            {showTestControls && (
              <>
                <div className="p-2 border rounded bg-gray-100 mb-2 flex items-center w-full justify-between">
                  <span>
                    lat: {testMarkerCoords[1].toFixed(4)}, long:
                    {testMarkerCoords[0].toFixed(4)}
                  </span>
                  <button
                    onClick={handleCopyToClipboard}
                    className="ml-2 p-1 text-xs bg-blue-500 text-white rounded-sm hover:bg-blue-600"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <button
                    className="p-1 text-xs bg-gray-200 rounded-sm"
                    onClick={() => moveMarker("up")}
                  >
                    Up
                  </button>
                  <div className="flex">
                    <button
                      className="p-1 text-xs bg-gray-200 rounded-sm mr-0.5"
                      onClick={() => moveMarker("left")}
                    >
                      Left
                    </button>
                    <button
                      className="p-1 text-xs bg-gray-200 rounded-sm ml-0.5"
                      onClick={() => moveMarker("right")}
                    >
                      Right
                    </button>
                  </div>
                  <button
                    className="p-1 text-xs bg-gray-200 rounded-sm"
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
              <MapPin
                strokeWidth={1.5}
                size={40}
                color={selectedTour?.id === tour.id ? "#ff3333" : "#000000"}
                fill={selectedTour?.id === tour.id ? "#ffcccc" : "transparent"}
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
