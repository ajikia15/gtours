"use client";

import React, { Suspense } from "react";
import ToursTable from "./Tours-table";
import ToursTableSkeleton from "./tours-table-skeleton";

interface AdminToursContentProps {
  page: number;
  params: { locale: string };
}

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Failed to load tours data
          </h2>
          <p className="text-red-600 mb-4">
            Please refresh the page to try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminToursContent({
  page,
  params,
}: AdminToursContentProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ToursTableSkeleton />}>
        <ToursTable page={page} params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}
