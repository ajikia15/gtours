"use client";

import {
  useFieldArray,
  Control,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Trash2, Plus, MoveIcon } from "lucide-react";
import Image from "next/image";
import { activityTypes } from "@/data/activity-constants";
import { z } from "zod";
import { tourSchema } from "@/validation/tourSchema";
import { useCoordinatePaste } from "@/lib/useCoordinatePaste";

type TourFormData = z.infer<typeof tourSchema>;

type Props = {
  control: Control<TourFormData>;
  disabled?: boolean;
};

// Helper component for tab triggers with empty field indicators
const LanguageTabTrigger = ({
  value,
  label,
  isEmpty,
}: {
  value: string;
  label: string;
  isEmpty: boolean;
}) => (
  <TabsTrigger value={value} className="relative">
    {label}
    {isEmpty && (
      <span
        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-sm"
        title="Some fields in this language are empty"
      ></span>
    )}
  </TabsTrigger>
);

export default function ActivityManager({ control, disabled = false }: Props) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "offeredActivities",
  });

  const [selectedActivityType, setSelectedActivityType] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addActivity = () => {
    if (!selectedActivityType) return;

    const activityType = activityTypes.find(
      (at) => at.id === selectedActivityType
    );
    if (!activityType) return;
    append({
      activityTypeId: selectedActivityType,
      nameSnapshot: activityType.name,
      priceIncrement: 0,
      coordinates: [0, 0] as [number, number],
      specificDescription: ["", "", ""], // [EN, GE, RU]
    });

    setSelectedActivityType("");
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      move(sourceIndex, destinationIndex);
    }
  };

  // Static content when not mounted or no fields
  const StaticContent = () => (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border rounded-lg p-4 space-y-4 bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <div className="relative w-5 h-5">
                <Image
                  src={`/${
                    activityTypes.find((at) => at.id === field.activityTypeId)
                      ?.pngFileName
                  }.png`}
                  alt={field.nameSnapshot}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              {field.nameSnapshot}
            </h4>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="text-gray-500 cursor-grab active:cursor-grabbing p-1">
                <MoveIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
          <ActivityFields control={control} index={index} />
        </div>
      ))}
    </div>
  );

  return (
    <fieldset disabled={disabled} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Activities</h3>
        <div className="flex gap-2">
          <Select
            value={selectedActivityType}
            onValueChange={setSelectedActivityType}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map((activityType) => (
                <SelectItem key={activityType.id} value={activityType.id}>
                  <div className="flex items-center gap-2">
                    <div className="relative w-4 h-4">
                      <Image
                        src={`/${activityType.pngFileName}.png`}
                        alt={activityType.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    {activityType.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={addActivity}
            disabled={!selectedActivityType}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Activities List with Drag and Drop */}
      {fields.length > 0 ? (
        isMounted ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tour-activities" direction="vertical">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {fields.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border rounded-lg p-4 space-y-4 transition-colors ${
                            snapshot.isDragging
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium flex items-center gap-2">
                              <div className="relative w-5 h-5">
                                <Image
                                  src={`/${
                                    activityTypes.find(
                                      (at) => at.id === field.activityTypeId
                                    )?.pngFileName
                                  }.png`}
                                  alt={field.nameSnapshot}
                                  fill
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                              {field.nameSnapshot}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <div
                                {...provided.dragHandleProps}
                                className="text-gray-500 cursor-grab active:cursor-grabbing p-1"
                              >
                                <MoveIcon className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                          <ActivityFields control={control} index={index} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <StaticContent />
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          No activities added yet. Select an activity type above to get started.
        </div>
      )}
    </fieldset>
  );
}

// Separate component for activity fields to avoid re-renders
function ActivityFields({
  control,
  index,
}: {
  control: Control<TourFormData>;
  index: number;
}) {
  const { setValue } = useFormContext<TourFormData>();

  // Smart paste functionality for this activity's coordinates
  const { handlePaste } = useCoordinatePaste(
    (lat) => setValue(`offeredActivities.${index}.coordinates.0`, lat),
    (lng) => setValue(`offeredActivities.${index}.coordinates.1`, lng)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {" "}
      <FormField
        control={control}
        name={`offeredActivities.${index}.priceIncrement`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price Increment ($)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Multilingual Descriptions with Global Tab Switcher */}
      <ActivityDescriptionTabs control={control} index={index} />
      <FormField
        control={control}
        name={`offeredActivities.${index}.coordinates.0`}
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Latitude</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                step="any"
                placeholder="41.715138"
                value={value ?? 0}
                onChange={(e) =>
                  onChange(e.target.value ? Number(e.target.value) : 0)
                }
                onPaste={(e) => handlePaste(e, true)}
                title="Paste Google Maps coordinates (e.g., '41.715138, 44.827096') into either field"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`offeredActivities.${index}.coordinates.1`}
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Longitude</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                step="any"
                placeholder="44.827096"
                value={value ?? 0}
                onChange={(e) =>
                  onChange(e.target.value ? Number(e.target.value) : 0)
                }
                onPaste={(e) => handlePaste(e, false)}
                title="Paste Google Maps coordinates (e.g., '41.715138, 44.827096') into either field"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Component for multilingual activity descriptions with tab switcher
function ActivityDescriptionTabs({
  control,
  index,
}: {
  control: Control<TourFormData>;
  index: number;
}) {
  // Watch the specific description fields for this activity
  const watchedDescriptions = useWatch({
    control,
    name: `offeredActivities.${index}.specificDescription`,
  });

  // Helper to check if any description field in a language is empty
  const isLanguageEmpty = (langIndex: number) => {
    return !watchedDescriptions?.[langIndex]?.trim();
  };

  return (
    <div className="space-y-4">
      <h5 className="text-sm font-medium text-gray-700">
        Specific Description
      </h5>
      <Tabs defaultValue="en" className="w-full">
        <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm rounded-md mb-4 pb-2 pt-2 px-2">
          <TabsList className="grid w-full grid-cols-3">
            <LanguageTabTrigger
              value="en"
              label="English"
              isEmpty={isLanguageEmpty(0)}
            />
            <LanguageTabTrigger
              value="ge"
              label="Georgian"
              isEmpty={isLanguageEmpty(1)}
            />
            <LanguageTabTrigger
              value="ru"
              label="Russian"
              isEmpty={isLanguageEmpty(2)}
            />
          </TabsList>
        </div>

        <TabsContent value="en">
          <FormField
            control={control}
            name={`offeredActivities.${index}.specificDescription.0`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Description (English)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Tour-specific details in English..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="ge">
          <FormField
            control={control}
            name={`offeredActivities.${index}.specificDescription.1`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Description (Georgian)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Tour-specific details in Georgian..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="ru">
          <FormField
            control={control}
            name={`offeredActivities.${index}.specificDescription.2`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Description (Russian)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Tour-specific details in Russian..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
