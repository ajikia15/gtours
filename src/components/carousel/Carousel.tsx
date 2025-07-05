import EmblaCarousel from "@/components/carousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "./embla.css";
import { isMobile } from "@/lib/isMobile";
import { headers } from "next/headers";

export default async function Carousel() {
  const OPTIONS: EmblaOptionsType = { axis: "x", loop: true };
  const userAgent = (await headers()).get("user-agent") || "";
  const mobile = isMobile(userAgent);
  return (
    <div>
      <EmblaCarousel options={OPTIONS} mobile={mobile} />
    </div>
  );
}
