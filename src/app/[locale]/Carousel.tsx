import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "./embla.css";
export default function Carousel() {
  const OPTIONS: EmblaOptionsType = { axis: "y", loop: true };
  const SLIDES = Array.from(Array(5).keys());

  return <EmblaCarousel slides={SLIDES} options={OPTIONS} />;
}
