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
        <div key={item.id} className="flex items-start relative">
          {/* Timeline dot */}
          <div className="flex-shrink-0 relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>

          {/* Content */}
          <div
            className={`ml-6 flex-1 ${
              index < items.length - 1 ? "pb-6 md:pb-8" : ""
            }`}
          >
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>

          {/* Dotted line - only show if not the last item */}
          {index < items.length - 1 && (
            <div className="absolute left-6 top-10 md:top-12 w-0.5 bottom-0 border-l-2 border-dashed border-gray-700 transform -translate-x-1/2"></div>
          )}
        </div>
      ))}
    </div>
  );
}
