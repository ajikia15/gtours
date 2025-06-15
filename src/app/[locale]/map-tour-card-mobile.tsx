import { Tour } from "@/types/Tour";

interface MapTourCardMobileProps {
  tour: Tour;
}

export default function MapTourCardMobile({ tour }: MapTourCardMobileProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 text-sm">
      <h3 className="font-semibold text-gray-900 mb-1 truncate">
        {tour.title}
      </h3>
      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
        {tour.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-green-600">
          From ${tour.basePrice}
        </span>
        <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
          View Details
        </button>
      </div>
    </div>
  );
}
