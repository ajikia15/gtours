import Carousel from "@/components/carousel/Carousel";
import QuickCategory from "@/components/carousel/QuickCategory";
import InteractiveMapSection from "./interactive-map-section";

export default async function HomePage() {
  // const t = useTranslations("Homepage");
  // const t = await getTranslations("Homepage");

  return (
    <div className="space-y-10 mb-10">
      <Carousel />
      <QuickCategory />
      <InteractiveMapSection />
    </div>
  );
}
