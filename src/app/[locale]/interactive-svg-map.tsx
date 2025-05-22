"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import geoData from "@/../public/gadm41_GEO_1.json";
import { MapPin } from "lucide-react";

export default function InteractiveMapSection() {
  return (
    <div className="flex max-h-128">
      {/* Make the container take full width and auto height for responsiveness */}
      <div className="w-1/3 h-full">card goes here</div>
      <ComposableMap
        className="w-2/3 "
        projectionConfig={{
          scale: 11000,
          center: [43.5, 42.3], // Adjust center
        }}
      >
        <Geographies geography={geoData}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#DDD"
                stroke="#FFF"
              />
            ))
          }
        </Geographies>
        <Marker coordinates={[44.8245, 41.7961]}>
          <MapPin size={48} />
        </Marker>
        <Marker coordinates={[42.6783, 41.8097]}>
          {/* Kutaisi coordinates */}
          <MapPin size={48} />
        </Marker>
      </ComposableMap>
    </div>
  );
}
