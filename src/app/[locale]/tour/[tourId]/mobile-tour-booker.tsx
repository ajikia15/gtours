"use client";
import { Tour } from "@/types/Tour";
import TourDetailsBooker from "./tour-details-booker";
import { GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Link } from "@/i18n/navigation";
export default function MobileTourBooker({ tour }: { tour: Tour }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="z-50 flex flex-col items-center justify-center w-full px-4 pb-4 pt-3 bg-white fixed bottom-0 inset-x-0 mb-20  border-t border border-gray-200 rounded-t-lg">
          <div className="flex justify-center">
            <div className="h-2 rounded-full bg-gray-100 w-24"></div>
          </div>
          <div className="flex items-center justify-between w-full pt-4">
            <div>
              <h1 className="text-2xl font-bold ">420 GEL</h1>
              <div className="flex flex-row text-gray-600">
                <p>Choose Date |&nbsp;</p>
                <p>2 Tourists</p>
              </div>
            </div>
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/tour/${tour.id}/book`}
            >
              <Button variant="brandred" className="font-bold">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-2xl font-bold ">420 GEL</h1>
                <div className="flex flex-row text-gray-600">
                  <p>Choose Date |&nbsp;</p>
                  <p>2 Tourists</p>
                </div>
              </div>
              <Link
                onClick={(e) => {
                  e.stopPropagation();
                }}
                href={`/tour/${tour.id}/book`}
              >
                <Button variant="brandred" className="font-bold">
                  Book Now
                </Button>
              </Link>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
