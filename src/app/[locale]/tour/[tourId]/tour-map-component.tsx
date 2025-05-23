"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, DivIcon } from "leaflet";
import { OfferedActivity } from "@/types/Activity";
import { Coordinates } from "@/validation/tourSchema";
import { renderToString } from "react-dom/server";
import { MapPin, Activity } from "lucide-react";

// Fix for default markers in React Leaflet
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

interface TourMapComponentProps {
  tourCoordinates?: Coordinates;
  activities: OfferedActivity[];
  tourTitle: string;
}

// Custom marker component
const createCustomIcon = (
  content: string,
  className: string = "activity-marker",
  color: string = "#10B981"
) => {
  return new DivIcon({
    html: renderToString(
      <div className={className} style={{ backgroundColor: color }}>
        {content}
      </div>
    ),
    className: "custom-div-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const createTourCenterIcon = () => {
  return new DivIcon({
    html: renderToString(
      <div className="tour-center-marker">
        <MapPin size={20} />
      </div>
    ),
    className: "custom-div-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
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
  tourTitle,
}: TourMapComponentProps) {
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
    <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={calculateZoom()}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Tour center marker */}
        {tourCoordinates && (
          <Marker
            position={[tourCoordinates[0], tourCoordinates[1]]}
            icon={createTourCenterIcon()}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">{tourTitle}</h3>
                <p className="text-sm text-gray-600">Tour Starting Point</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Activity markers */}
        {activities.map((activity, index) => {
          const activityColor = getActivityColor(activity.activityTypeId);
          const activityIcon = createCustomIcon(
            (index + 1).toString(),
            "activity-marker",
            activityColor
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
                    <Activity size={16} style={{ color: activityColor }} />
                    <h3 className="font-bold text-lg">
                      {activity.nameSnapshot}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.specificDescription}
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
