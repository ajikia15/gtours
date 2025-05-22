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

  function handleTourClick(tour: Tour) {
    setSelectedTour(tour);
  }

  return (
    <div className="flex max-h-128">
      <div className="w-1/3 h-full p-4">
        {selectedTour ? (
          <MapTourCard tour={selectedTour} />
        ) : (
          <p className="text-gray-500">Click on a tour marker to see details</p>
        )}
      </div>
      <ComposableMap
        className="w-2/3"
        projectionConfig={{
          scale: 9000,
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
      </ComposableMap>
    </div>
  );
}
