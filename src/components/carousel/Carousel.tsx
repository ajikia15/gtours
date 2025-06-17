import EmblaCarousel from "@/components/carousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "./embla.css";

export default function Carousel() {
  const OPTIONS: EmblaOptionsType = { axis: "x", loop: true };
  // Remove SLIDES as we'll use the default in EmblaCarousel

  return (
    <div>
      <EmblaCarousel options={OPTIONS} />
    </div>
  );
}
