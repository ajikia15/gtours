"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MDXEditor } from "./ui/mdx-editor";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { MoveIcon, Trash, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScheduleItem } from "@/types/Tour";
import { useEffect, useState } from "react";

type Props = {
  schedules?: ScheduleItem[];
  onSchedulesChange: (schedules: ScheduleItem[]) => void;
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

// Component for schedules list by language
function SchedulesListByLanguage({
  schedules,
  languageIndex,
  isClient,
  handleDragEnd,
  deleteSchedule,
  updateSchedule,
}: {
  schedules: ScheduleItem[];
  languageIndex: number;
  isClient: boolean;
  handleDragEnd: (result: DropResult) => void;
  deleteSchedule: (id: string) => void;
  updateSchedule: (
    id: string,
    field: "title" | "description",
    languageIndex: number,
    value: string
  ) => void;
}) {
  const languageLabels = ["English", "Georgian", "Russian"];

  const StaticContent = () => (
    <div className="space-y-4">
      {schedules.map((schedule, index) => (
        <Card key={schedule.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                Schedule Item {index + 1}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => deleteSchedule(schedule.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`title-${languageIndex}-${schedule.id}`}>
                Title ({languageLabels[languageIndex]})
              </Label>
              <Input
                id={`title-${languageIndex}-${schedule.id}`}
                value={schedule.title[languageIndex]}
                onChange={(e) =>
                  updateSchedule(
                    schedule.id,
                    "title",
                    languageIndex,
                    e.target.value
                  )
                }
                placeholder={`Enter schedule title in ${languageLabels[languageIndex]}`}
              />
            </div>
            <div>
              <Label htmlFor={`description-${languageIndex}-${schedule.id}`}>
                Description ({languageLabels[languageIndex]})
              </Label>
              <MDXEditor
                value={schedule.description[languageIndex]}
                onChange={(value) =>
                  updateSchedule(
                    schedule.id,
                    "description",
                    languageIndex,
                    value
                  )
                }
                placeholder={`Enter schedule description in ${languageLabels[languageIndex]}`}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return isClient ? (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="schedules" direction="vertical">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {schedules.map((schedule, index) => (
              <Draggable
                key={schedule.id}
                draggableId={schedule.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <Card
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className={`${snapshot.isDragging ? "shadow-lg" : ""}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">
                          Schedule Item {index + 1}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab p-1 hover:bg-gray-100 rounded"
                          >
                            <MoveIcon className="h-4 w-4 text-gray-400" />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSchedule(schedule.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label
                          htmlFor={`title-${languageIndex}-${schedule.id}`}
                        >
                          Title ({languageLabels[languageIndex]})
                        </Label>
                        <Input
                          id={`title-${languageIndex}-${schedule.id}`}
                          value={schedule.title[languageIndex]}
                          onChange={(e) =>
                            updateSchedule(
                              schedule.id,
                              "title",
                              languageIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Enter schedule title in ${languageLabels[languageIndex]}`}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`description-${languageIndex}-${schedule.id}`}
                        >
                          Description ({languageLabels[languageIndex]})
                        </Label>
                        <MDXEditor
                          value={schedule.description[languageIndex]}
                          onChange={(value) =>
                            updateSchedule(
                              schedule.id,
                              "description",
                              languageIndex,
                              value
                            )
                          }
                          placeholder={`Enter schedule description in ${languageLabels[languageIndex]}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
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
  );
}

export default function SchedulesManager({
  schedules = [],
  onSchedulesChange,
}: Props) {
  const [isClient, setIsClient] = useState(false);
  const [scheduleCounter, setScheduleCounter] = useState(0);

  // Helper to check if any schedule has empty fields in a language
  const isLanguageEmpty = (langIndex: number) => {
    return schedules.some(
      (schedule) =>
        !schedule.title[langIndex]?.trim() ||
        !schedule.description[langIndex]?.trim()
    );
  };

  // Ensure consistent ID generation between server and client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Initialize counter based on existing schedules to avoid conflicts
    const maxId = schedules.reduce((max, schedule) => {
      const match = schedule.id.match(/schedule-(\d+)/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    setScheduleCounter(maxId + 1);
  }, [schedules]);

  const addNewSchedule = () => {
    const newSchedule: ScheduleItem = {
      id: `schedule-${scheduleCounter}`,
      title: ["", "", ""], // [EN, GE, RU]
      description: ["", "", ""], // [EN, GE, RU]
    };
    setScheduleCounter((prev) => prev + 1);
    onSchedulesChange([...schedules, newSchedule]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(schedules);
    const [reorderedSchedule] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedSchedule);

    onSchedulesChange(items);
  };

  const deleteSchedule = (id: string) => {
    const updatedSchedules = schedules.filter((schedule) => schedule.id !== id);
    onSchedulesChange(updatedSchedules);
  };

  const updateSchedule = (
    id: string,
    field: "title" | "description",
    languageIndex: number,
    value: string
  ) => {
    const updatedSchedules = schedules.map((schedule) => {
      if (schedule.id === id) {
        const updatedField = [...schedule[field]];
        updatedField[languageIndex] = value;
        return { ...schedule, [field]: updatedField };
      }
      return schedule;
    });
    onSchedulesChange(updatedSchedules);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Tour Schedules</h3>
          <p className="text-sm text-gray-500">
            Add daily schedules or itinerary items for your tour
          </p>
        </div>
        <Button type="button" onClick={addNewSchedule} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule Item
        </Button>
      </div>{" "}
      {/* Schedules List with Global Tab Switcher */}
      {schedules.length > 0 ? (
        <Tabs defaultValue="en" className="w-full">
          <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm rounded-md mb-4 pb-2 pt-2 px-2">
            <TabsList className="grid w-full grid-cols-3">
              <LanguageTabTrigger
                value="en"
                label="English"
                isEmpty={isLanguageEmpty(0)}
              />
              <LanguageTabTrigger
                value="ka"
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
            <SchedulesListByLanguage
              schedules={schedules}
              languageIndex={0}
              isClient={isClient}
              handleDragEnd={handleDragEnd}
              deleteSchedule={deleteSchedule}
              updateSchedule={updateSchedule}
            />
          </TabsContent>

          <TabsContent value="ka">
            <SchedulesListByLanguage
              schedules={schedules}
              languageIndex={1}
              isClient={isClient}
              handleDragEnd={handleDragEnd}
              deleteSchedule={deleteSchedule}
              updateSchedule={updateSchedule}
            />
          </TabsContent>

          <TabsContent value="ru">
            <SchedulesListByLanguage
              schedules={schedules}
              languageIndex={2}
              isClient={isClient}
              handleDragEnd={handleDragEnd}
              deleteSchedule={deleteSchedule}
              updateSchedule={updateSchedule}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No schedule items added yet.</p>
          <p className="text-sm">
            Click &quot;Add Schedule Item&quot; to get started.
          </p>
        </div>
      )}
    </div>
  );
}
