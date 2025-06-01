import EmblaCarousel from "@/components/carousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "./embla.css";
import BookingBar from "../booking-bar";
import { Tour } from "@/types/Tour";
export default function Carousel({ tours }: { tours: Tour[] }) {
  const OPTIONS: EmblaOptionsType = { axis: "x", loop: true };
  const SLIDES = Array.from(Array(5).keys());

  return (
    <div className="relative">
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      <div className="absolute left-0 right-0 bottom-0 flex justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-4xl"
          style={{
            transform: "translateY(55%)",
          }}
        >
          <BookingBar tours={tours} mode="add" />
        </div>
      </div>
    </div>
  );
}
