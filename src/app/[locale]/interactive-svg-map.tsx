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

export default function InteractiveMapSection({ tours }: { tours: Tour[] }) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(
    tours[0] || null
  );
  const testMode = false;
  const [testMarkerCoords, setTestMarkerCoords] = useState<[number, number]>([
    43.5, 42.3,
  ]);
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

  return (
    <div className="flex">
      <div className="w-1/3 h-full p-4">
        {selectedTour ? (
          <MapTourCard tour={selectedTour} />
        ) : (
          <p className="text-gray-500">Click on a tour marker to see details</p>
        )}
      </div>
      <div className="w-2/3 relative">
        {testMode && (
          <div className="flex flex-col items-center mt-4 absolute top-0 right-0">
            <div className="p-2 border rounded bg-gray-100 mb-2">
              lat: {testMarkerCoords[1].toFixed(4)}, long:
              {testMarkerCoords[0].toFixed(4)}
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

          {testMode && (
            <Marker coordinates={testMarkerCoords}>
              <circle r={10} fill="#FF0000" stroke="#fff" strokeWidth={2} />
            </Marker>
          )}
        </ComposableMap>
      </div>
    </div>
  );
}
