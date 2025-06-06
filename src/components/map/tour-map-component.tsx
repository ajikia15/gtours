"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, DivIcon } from "leaflet";
import { OfferedActivity } from "@/types/Activity";
import { Coordinates } from "@/validation/tourSchema";
import { renderToString } from "react-dom/server";
import { Activity } from "lucide-react";
import { activityTypes } from "@/data/activity-constants";
import Image from "next/image";
// Fix for default markers in React Leaflet
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getActivityIcon } from "@/lib/imageHelpers";
import { getLocalizedActivityDescription } from "@/lib/localizationHelpers";
import { useLocale } from "next-intl";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

interface TourMapSectionProps {
  tourCoordinates?: Coordinates;
  activities: OfferedActivity[];
  tourTitle: string;
}

// Get icon based on activity type

// Get icon for popup (colored version)
const getActivityIconForPopup = (activityTypeId: string, color: string) => {
  const activityType = activityTypes.find((at) => at.id === activityTypeId);

  if (activityType) {
    return (
      <Image
        src={`/${activityType.pngFileName}.png`}
        alt={activityType.name}
        width={16}
        height={16}
        style={{
          width: "16px",
          height: "16px",
          filter: `brightness(0) saturate(100%) sepia(100%) hue-rotate(${getHueRotation(
            color
          )}deg)`,
        }}
      />
    );
  }

  // Fallback to Activity icon for unknown types
  return <Activity size={16} style={{ color }} />;
};

// Helper to convert hex color to hue rotation (approximate)
const getHueRotation = (hexColor: string): number => {
  const colorMap: Record<string, number> = {
    "#3B82F6": 220, // blue
    "#10B981": 160, // green
    "#06B6D4": 190, // cyan
    "#F59E0B": 40, // orange
    "#8B5CF6": 270, // purple
    "#6B7280": 0, // gray
  };
  return colorMap[hexColor] || 0;
};

// Custom marker component
const createCustomIcon = (
  icon: React.ReactElement,
  className: string = "activity-marker"
) => {
  return new DivIcon({
    html: renderToString(
      <div className={`activity-marker ${className} bg-brand-secondary`}>
        {icon}
      </div>
    ),
    className: "custom-div-icon",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
    popupAnchor: [0, -64],
  });
};

// Activity type colors for visual distinction
const getActivityColor = (activityTypeId: string): string => {
  const colors = {
    skiing: "#3B82F6",
    hiking: "#10B981",
    rafting: "#06B6D4",
    climbing: "#F59E0B",
    camping: "#8B5CF6",
    default: "#6B7280",
  };

  const activityType = activityTypeId.toLowerCase();
  return (colors as any)[activityType] || colors.default;
};

export default function TourMapComponent({
  tourCoordinates,
  activities,
}: // tourTitle,
TourMapSectionProps) {
  const locale = useLocale();

  // Default center (Tbilisi, Georgia) if no coordinates provided
  const defaultCenter: LatLngExpression = [41.7151, 44.8271];

  // Use tour coordinates if available, otherwise calculate center from activities
  let mapCenter: LatLngExpression = defaultCenter;

  if (tourCoordinates) {
    mapCenter = [tourCoordinates[0], tourCoordinates[1]];
  } else if (activities.length > 0) {
    // Calculate center from activity coordinates
    const avgLat =
      activities.reduce((sum, activity) => sum + activity.coordinates[0], 0) /
      activities.length;
    const avgLng =
      activities.reduce((sum, activity) => sum + activity.coordinates[1], 0) /
      activities.length;
    mapCenter = [avgLat, avgLng];
  }

  // Calculate appropriate zoom level based on coordinate spread
  const calculateZoom = (): number => {
    if (activities.length === 0) return 10;

    const lats = activities.map((a) => a.coordinates[0]);
    const lngs = activities.map((a) => a.coordinates[1]);

    if (tourCoordinates) {
      lats.push(tourCoordinates[0]);
      lngs.push(tourCoordinates[1]);
    }

    const latSpread = Math.max(...lats) - Math.min(...lats);
    const lngSpread = Math.max(...lngs) - Math.min(...lngs);
    const maxSpread = Math.max(latSpread, lngSpread);

    if (maxSpread > 1) return 8;
    if (maxSpread > 0.5) return 10;
    if (maxSpread > 0.1) return 12;
    return 14;
  };

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg ">
      <MapContainer
        center={mapCenter}
        zoom={calculateZoom()}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          minZoom={0}
          maxZoom={19}
          className=" z-10"
        />

        {/* Activity markers */}
        {activities.map((activity, index) => {
          const activityColor = getActivityColor(activity.activityTypeId);
          const activityIcon = createCustomIcon(
            getActivityIcon(activity.activityTypeId, undefined, 26)
          );

          return (
            <Marker
              key={`${activity.activityTypeId}-${index}`}
              position={[activity.coordinates[0], activity.coordinates[1]]}
              icon={activityIcon}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    {getActivityIconForPopup(
                      activity.activityTypeId,
                      activityColor
                    )}
                    <h3 className="font-bold text-lg">
                      {activity.nameSnapshot}
                    </h3>
                  </div>{" "}
                  <p className="text-sm text-gray-600 mb-2">
                    {getLocalizedActivityDescription(activity, locale)}
                  </p>
                  {activity.priceIncrement > 0 && (
                    <p className="text-sm font-semibold text-green-600">
                      +${activity.priceIncrement}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
