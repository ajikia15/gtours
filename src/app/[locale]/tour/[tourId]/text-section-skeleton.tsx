export default function TextSectionSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Placeholder for the <h1> "About the Tour" */}
      <div className="h-8 bg-gray-300 rounded w-1/3 mb-4 mt-2"></div>

      {/* Placeholder for the tour-description (ReactMarkdown content) */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
      </div>
    </div>
  );
}
