import { Suspense } from "react";
import HomeContent from "./home-content";
import HomePageSkeleton from "./home-skeleton";

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
