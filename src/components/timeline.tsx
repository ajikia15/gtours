import React from "react";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-start mb-12 last:mb-0">
          {/* Timeline dot */}
          <div className="flex-shrink-0 relative">
            <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm z-10 relative">
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Dotted line - only show if not the last item */}
            {index < items.length - 1 && (
              <div className="absolute left-1/2 transform -translate-x-1/2 top-12 w-0.5 h-16 border-l-2 border-dashed border-gray-700"></div>
            )}
          </div>

          {/* Content */}
          <div className="ml-6 flex-1">
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
