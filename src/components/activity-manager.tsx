"use client";

import { useFieldArray, Control } from "react-hook-form";
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
import { ACTIVITY_TYPES } from "@/data/activity-constants";
import { z } from "zod";
import { tourSchema } from "@/validation/tourSchema";

type TourFormData = z.infer<typeof tourSchema>;

type Props = {
  control: Control<TourFormData>;
  disabled?: boolean;
};

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

    const activityType = ACTIVITY_TYPES.find(
      (at) => at.id === selectedActivityType
    );
    if (!activityType) return;

    append({
      activityTypeId: selectedActivityType,
      nameSnapshot: activityType.name,
      priceIncrement: 0,
      coordinates: [0, 0] as [number, number],
      specificDescription: "",
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
                    ACTIVITY_TYPES.find((at) => at.id === field.activityTypeId)
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
              {ACTIVITY_TYPES.map((activityType) => (
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
                                    ACTIVITY_TYPES.find(
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <FormField
        control={control}
        name={`offeredActivities.${index}.specificDescription`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specific Description</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Tour-specific details..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
                placeholder="41.7151"
                value={value ?? 0}
                onChange={(e) =>
                  onChange(e.target.value ? Number(e.target.value) : 0)
                }
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
                placeholder="44.7831"
                value={value ?? 0}
                onChange={(e) =>
                  onChange(e.target.value ? Number(e.target.value) : 0)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
