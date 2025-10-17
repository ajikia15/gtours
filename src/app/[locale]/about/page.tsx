// import { getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RatingCard from "./rating-card";
import Timeline from "@/components/timeline";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import RatingCarousel from "@/components/rating-carousel";
import { getActiveRatings } from "@/data/ratings";
import { getLocale } from "next-intl/server";

export default async function AboutPage() {
  // const t = await getTranslations("Pages.about");
  const locale = await getLocale();
  const activeRatings = await getActiveRatings(6);

  // Debug: Log what we're fetching
  console.log("Active ratings fetched:", activeRatings);
  console.log("Number of active ratings:", activeRatings.length);
  if (activeRatings.length > 0) {
    console.log("First rating:", activeRatings[0]);
  }

  // Helper function to get localized text
  const getLocalizedText = (textArray: string[], locale: string) => {
    const langIndex = locale === "en" ? 0 : locale === "ge" ? 1 : 2;
    return textArray[langIndex] || textArray[0] || "";
  };

  const timelineItems = [
    {
      id: "1",
      title: "Travel with us in Europe",
      description:
        "Travel with us in Europe and get the best experience ever in the west Europe",
    },
    {
      id: "2",
      title: "Travel with us in Europe",
      description:
        "Travel with us in Europe and get the best experience ever in the west Europe",
    },
    {
      id: "3",
      title: "Travel with us in Europe",
      description:
        "Travel with us in Europe and get the best experience ever in the west Europe",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-0">
      {/* <Header title={t("title")} /> */}
      <section className="grid grid-cols-1 md:grid-cols-2 py-8 md:py-12 xl:py-20 w-full max-w-5xl mx-auto">
        <div className="flex items-start md:items-center">
          <div>
            <p className="text-brand-secondary font-light flex flex-row gap-4 items-center italic mb-4">
              Explore us <ArrowRight size={16} />
            </p>
            <h3 className="font-bold text-3xl mb-3">
              Unique Tours For <br /> Your Adventure
            </h3>
            <p className="text-gray-500">
              We are passionate to create <br /> Something Unique for Your
              Adventure
            </p>
          </div>
        </div>
        <div className="relative md:min-h-[350px]">
          {/* Mobile layout: Stack images with slight overlap */}
          <div className="md:hidden flex flex-col items-center space-y-4">
            <Image
              src="https://picsum.photos/250/250?random=6"
              alt="Unique Tours Adventure"
              width={250}
              height={250}
              className="rounded-lg aspect-square"
            />
            <Image
              src="https://picsum.photos/180/180?random=7"
              alt="Adventure Experience"
              width={180}
              height={180}
              className="rounded-lg aspect-square shadow-lg mt-4"
            />
          </div>

          {/* Desktop layout: Overlapping images */}
          <div className="hidden md:block">
            <div className="flex justify-end">
              <Image
                src="https://picsum.photos/300/300?random=6"
                alt="Unique Tours Adventure"
                width={300}
                height={300}
                className="rounded-lg aspect-square"
              />
            </div>
            <Image
              src="https://picsum.photos/180/180?random=7"
              alt="Adventure Experience"
              width={200}
              height={200}
              className="rounded-lg aspect-square absolute top-1/2 transform -translate-y-1/2 z-10 shadow-lg"
              style={{
                right: "190px",
              }}
            />
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 py-8 md:py-12 xl:py-20  w-full mx-auto">
        <div className="flex flex-col items-center md:items-start order-2 md:order-1">
          <h3 className="underline underline-offset-8 text-brand-secondary italic font-light text-center md:text-left">
            What we offer
          </h3>
          <div className="relative mt-8 md:mt-12 md:min-h-[400px]">
            {/* Mobile layout: Grid with slight overlaps */}
            <div className="md:hidden space-y-4">
              <div className="flex justify-center">
                <Image
                  src="https://picsum.photos/280/280?random=8"
                  alt="What we offer"
                  width={280}
                  height={280}
                  className="rounded-lg aspect-square"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <Image
                  src="https://picsum.photos/120/200?random=9"
                  alt="Our service"
                  width={120}
                  height={200}
                  className="rounded-lg shadow-lg"
                />
                <Image
                  src="https://picsum.photos/200/200?random=10"
                  alt="Our experience"
                  width={200}
                  height={200}
                  className="rounded-lg aspect-square shadow-lg ml-3"
                />
              </div>
            </div>

            {/* Desktop layout: Complex overlapping */}
            <div className="hidden md:block">
              <Image
                src="https://picsum.photos/350/350?random=8"
                alt="What we offer"
                width={350}
                height={350}
                className="rounded-lg aspect-square"
              />
              <Image
                src="https://picsum.photos/140/240?random=9"
                alt="Our service"
                width={140}
                height={240}
                className="rounded-lg absolute top-1/2 z-10 shadow-lg"
                style={{
                  left: "-70px",
                }}
              />
              <Image
                src="https://picsum.photos/240/240?random=10"
                alt="Our experience"
                width={240}
                height={240}
                className="rounded-lg aspect-square absolute top-1/2 z-10 shadow-lg"
                style={{
                  left: "175px",
                }}
              />
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 flex flex-col space-y-6 md:space-y-8 md:my-20">
          <h3 className="font-bold text-xl">
            Get The Best <br /> Memories Ever
          </h3>
          <div>
            <Timeline items={timelineItems} />
          </div>
        </div>
      </section>
      <section className="py-8 md:py-12 xl:py-16">
        <h2 className="font-bold text-xl">What People Say About Us</h2>
        <div className="mt-6 md:mt-12">
          <RatingCarousel>
            {activeRatings.length > 0
              ? activeRatings.map((rating, index) => {
                  console.log(`Processing rating ${index}:`, rating);
                  console.log(`Rating title array:`, rating.title);
                  console.log(`Rating review array:`, rating.review);
                  console.log(`Current locale:`, locale);

                  const localizedTitle = getLocalizedText(rating.title, locale);
                  const localizedReview = getLocalizedText(
                    rating.review,
                    locale
                  );

                  console.log(`Localized title:`, localizedTitle);
                  console.log(`Localized review:`, localizedReview);

                  return (
                    <RatingCard
                      key={rating.id}
                      title={localizedTitle}
                      review={localizedReview}
                      author={rating.author}
                      number={rating.rating.toString()}
                    />
                  );
                })
              : [
                  <RatingCard key="1" />,
                  <RatingCard key="2" />,
                  <RatingCard key="3" />,
                  <RatingCard key="4" />,
                  <RatingCard key="5" />,
                  <RatingCard key="6" />,
                ]}
          </RatingCarousel>
        </div>
      </section>
      <section className="py-8 md:py-12 xl:py-16">
        <h2 className="font-bold text-xl">FAQ</h2>
        <Accordion type="single" collapsible className="w-full mt-4 md:mt-6">
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
