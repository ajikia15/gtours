import { getTranslations } from "next-intl/server";
import Header from "../header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RatingCard from "./rating-card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default async function AboutPage() {
  const t = await getTranslations("Pages.about");

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <Header title={t("title")} />
      <section className="grid grid-cols-1 md:grid-cols-2 my-20 w-full max-w-5xl mx-auto">
        <div className="my-6 ">
          <p className="text-brand-secondary font-light flex flex-row gap-4 items-center italic mb-4">
            Explore us <ArrowRight size={16} />
          </p>
          <h3 className="font-bold text-xl mb-3">
            Unique Tours For <br /> Your Adventure
          </h3>
          <p className="text-gray-500">
            We are passionate to create <br /> Something Unique for Your
            Adventure
          </p>
        </div>
        <div className="relative">
          {/* Container for the main image positioned to the right */}
          <div className="flex justify-end">
            <Image
              src="https://picsum.photos/300/300?random=6"
              alt="Unique Tours Adventure"
              width={300}
              height={300}
              className="rounded-lg aspect-square"
            />
          </div>

          {/* Smaller overlaying image - positioned absolutely to be half outside */}
          <Image
            src="https://picsum.photos/180/180?random=7"
            alt="Adventure Experience"
            width={200}
            height={200}
            className="rounded-lg aspect-square absolute top-1/2 transform -translate-y-1/2 z-10  shadow-lg"
            style={{
              right: "190px", // 300px (main image width) - 90px (half of small image) = 210px
            }}
          />
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 my-20 w-full  mx-auto">
        <div className="flex flex-col items-center">
          <h3 className="underline underline-offset-8 text-brand-secondary italic font-light">
            What we offer
          </h3>
          <div className="relative mt-12">
            {/* Main center image */}
            <Image
              src="https://picsum.photos/350/350?random=8"
              alt="What we offer"
              width={350}
              height={350}
              className="rounded-lg aspect-square"
            />

            {/* Left overlaying image - middle of image aligned with left border of big image */}
            <Image
              src="https://picsum.photos/140/240?random=9"
              alt="Our service"
              width={140}
              height={240}
              className="rounded-lg absolute top-1/2 z-10 shadow-lg"
              style={{
                left: "-70px", // Half of image width (140px/2 = 70px) to center it on the border
              }}
            />

            {/* Right overlaying image - starts at the middle horizontal point, starts from vertical center */}
            <Image
              src="https://picsum.photos/240/240?random=10"
              alt="Our experience"
              width={240}
              height={240}
              className="rounded-lg aspect-square absolute top-1/2 z-10 shadow-lg"
              style={{
                left: "175px", // Starts at the middle of the 350px image (350/2 = 175px from left)
              }}
            />
          </div>
        </div>
        <div className="my-20">
          <h3 className="font-bold text-xl">
            Get The Best <br /> Memories Ever
          </h3>
        </div>
      </section>
      <section>
        <h2 className="font-bold text-xl">what people say about us</h2>
        <div className="grid-cols-2 lg:grid-cols-4 grid w-full gap-4">
          <RatingCard />
          <RatingCard />
          <RatingCard />
          <RatingCard />
        </div>
      </section>
      <section>
        <h2 className="font-bold text-xl">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={"1"}>
            <AccordionTrigger>how to plan tour beforehand?</AccordionTrigger>
            <AccordionContent>i dont know</AccordionContent>
          </AccordionItem>
          <AccordionItem value={"2"}>
            <AccordionTrigger>how to plan tour beforehand?</AccordionTrigger>
            <AccordionContent>how to plan tour beforehand?</AccordionContent>
          </AccordionItem>
          <AccordionItem value={"3"}>
            <AccordionTrigger>how to plan tour beforehand?</AccordionTrigger>
            <AccordionContent>how to plan tour beforehand?</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
