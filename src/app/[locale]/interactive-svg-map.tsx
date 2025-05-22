"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import geoData from "@/../public/gadm41_GEO_1.json";
import { Pin } from "lucide-react";
import { Tour } from "@/types/Tour";

export default function InteractiveMapSection({ tours }: { tours: Tour[] }) {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  function handleRegionClick(geo: any) {
    setSelectedRegion(geo.properties);
  }

  return (
    <div className="flex max-h-128">
      <div className="w-1/3 h-full">
        {selectedRegion ? (
          <div>
            <h3>Selected Region:</h3>
            <p>{selectedRegion.NAME_1}</p>
          </div>
        ) : (
          <p>Hover over a region to see its name</p>
        )}
      </div>
      <ComposableMap
        className="w-2/3 "
        projectionConfig={{
          scale: 11000,
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
                fill={
                  selectedRegion &&
                  geo.properties.GID_1 === selectedRegion.GID_1
                    ? "#6699cc"
                    : "#e0e0e0"
                }
                stroke="#FFF"
                strokeWidth={3}
                onClick={() => handleRegionClick(geo)}
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
        {tours.map(
          (tour) => (
            console.log(tour.long, tour.lat),
            (
              <Marker key={tour.id} coordinates={[tour.long, tour.lat]}>
                <Pin strokeWidth={1.5} size={40} />
              </Marker>
            )
          )
        )}
        {/* <Marker coordinates={[44.7, 41.95]}>
          <Pin strokeWidth={1.5} size={40} />
        </Marker> */}
      </ComposableMap>
    </div>
  );
}
