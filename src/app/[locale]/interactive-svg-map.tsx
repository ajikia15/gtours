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

export default function InteractiveMapSection() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);

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
                onClick={() => {
                  setSelectedRegion(geo.properties);
                }}
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
        <Marker coordinates={[44.7, 41.95]}>
          <Pin strokeWidth={1.5} size={40} />
        </Marker>
        <Marker coordinates={[42.6783, 42.8097]}>
          {/* Kutaisi coordinates */}
          <Pin strokeWidth={1.5} size={40} />
        </Marker>
      </ComposableMap>
    </div>
  );
}
