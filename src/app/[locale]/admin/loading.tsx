export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Page title skeleton */}
      <div className="h-9 bg-gray-200 animate-pulse rounded w-64" />

      {/* Action button skeleton */}
      <div className="h-10 bg-gray-200 animate-pulse rounded w-32" />

      {/* Content area skeleton */}
      <div className="space-y-4">
        {/* Table header skeleton */}
        <div className="border rounded-lg p-4">
          <div className="grid grid-cols-5 gap-4 mb-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>

          {/* Table rows skeleton */}
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 py-3 border-t">
              {Array.from({ length: 5 }, (_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-gray-100 animate-pulse rounded"
                />
              ))}
            </div>
          ))}

          {/* Pagination skeleton */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-8 w-8 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
