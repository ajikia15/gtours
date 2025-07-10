import { getTranslations } from "next-intl/server";
import Header from "../header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function AboutPage() {
  const t = await getTranslations("Pages.about");

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <Header title={t("title")} />

      <section className="grid grid-cols-2">
        <div>Explore us</div>
        <div>images</div>
        <div>what we offer</div>
        <div>get the best memories ever </div>
      </section>
      <section>
        <h2 className="font-bold text-xl">what people say about us</h2>
        <div className="grid-cols-4">
          <div className="aspect-square rounded-xl bg-rose-50 flex flex-col justify-center relative p-8 max-w-[300px]">
            <h3 className="font-bold w-full">rating.title</h3>
            <p className="w-full mt-2 text-gray-500">
              rating.review Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Ad, quo? rating.review Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
            <p className="text-end w-full mt-4 font-semibold">rating.author</p>
            <span className="text-7xl text-rose-200 italic font-semibold absolute left-0 bottom-0 px-8 pb-2 ">
              01
            </span>
          </div>
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
