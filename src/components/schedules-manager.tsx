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

export default function SchedulesManager({
  schedules = [],
  onSchedulesChange,
}: Props) {
  const [isClient, setIsClient] = useState(false);
  const [scheduleCounter, setScheduleCounter] = useState(0);
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
      </div>

      {/* Only render drag and drop after client hydration */}
      {isClient ? (
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
                        <CardContent>
                          <Tabs defaultValue="en" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="en">English</TabsTrigger>
                              <TabsTrigger value="ka">Georgian</TabsTrigger>
                              <TabsTrigger value="ru">Russian</TabsTrigger>
                            </TabsList>

                            <TabsContent value="en" className="space-y-4">
                              <div>
                                <Label htmlFor={`title-en-${schedule.id}`}>
                                  Title (English)
                                </Label>
                                <Input
                                  id={`title-en-${schedule.id}`}
                                  value={schedule.title[0]}
                                  onChange={(e) =>
                                    updateSchedule(
                                      schedule.id,
                                      "title",
                                      0,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter schedule title in English"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`description-en-${schedule.id}`}
                                >
                                  Description (English)
                                </Label>
                                <MDXEditor
                                  value={schedule.description[0]}
                                  onChange={(value) =>
                                    updateSchedule(
                                      schedule.id,
                                      "description",
                                      0,
                                      value
                                    )
                                  }
                                  placeholder="Enter schedule description in English"
                                />
                              </div>
                            </TabsContent>

                            <TabsContent value="ka" className="space-y-4">
                              <div>
                                <Label htmlFor={`title-ka-${schedule.id}`}>
                                  Title (Georgian)
                                </Label>
                                <Input
                                  id={`title-ka-${schedule.id}`}
                                  value={schedule.title[1]}
                                  onChange={(e) =>
                                    updateSchedule(
                                      schedule.id,
                                      "title",
                                      1,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter schedule title in Georgian"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`description-ka-${schedule.id}`}
                                >
                                  Description (Georgian)
                                </Label>
                                <MDXEditor
                                  value={schedule.description[1]}
                                  onChange={(value) =>
                                    updateSchedule(
                                      schedule.id,
                                      "description",
                                      1,
                                      value
                                    )
                                  }
                                  placeholder="Enter schedule description in Georgian"
                                />
                              </div>
                            </TabsContent>

                            <TabsContent value="ru" className="space-y-4">
                              <div>
                                <Label htmlFor={`title-ru-${schedule.id}`}>
                                  Title (Russian)
                                </Label>
                                <Input
                                  id={`title-ru-${schedule.id}`}
                                  value={schedule.title[2]}
                                  onChange={(e) =>
                                    updateSchedule(
                                      schedule.id,
                                      "title",
                                      2,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter schedule title in Russian"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`description-ru-${schedule.id}`}
                                >
                                  Description (Russian)
                                </Label>
                                <MDXEditor
                                  value={schedule.description[2]}
                                  onChange={(value) =>
                                    updateSchedule(
                                      schedule.id,
                                      "description",
                                      2,
                                      value
                                    )
                                  }
                                  placeholder="Enter schedule description in Russian"
                                />
                              </div>
                            </TabsContent>
                          </Tabs>
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
        // SSR fallback - non-draggable version
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
              <CardContent>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ka">Georgian</TabsTrigger>
                    <TabsTrigger value="ru">Russian</TabsTrigger>
                  </TabsList>

                  <TabsContent value="en" className="space-y-4">
                    <div>
                      <Label htmlFor={`title-en-${schedule.id}`}>
                        Title (English)
                      </Label>
                      <Input
                        id={`title-en-${schedule.id}`}
                        value={schedule.title[0]}
                        onChange={(e) =>
                          updateSchedule(
                            schedule.id,
                            "title",
                            0,
                            e.target.value
                          )
                        }
                        placeholder="Enter schedule title in English"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-en-${schedule.id}`}>
                        Description (English)
                      </Label>
                      <MDXEditor
                        value={schedule.description[0]}
                        onChange={(value) =>
                          updateSchedule(schedule.id, "description", 0, value)
                        }
                        placeholder="Enter schedule description in English"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="ka" className="space-y-4">
                    <div>
                      <Label htmlFor={`title-ka-${schedule.id}`}>
                        Title (Georgian)
                      </Label>
                      <Input
                        id={`title-ka-${schedule.id}`}
                        value={schedule.title[1]}
                        onChange={(e) =>
                          updateSchedule(
                            schedule.id,
                            "title",
                            1,
                            e.target.value
                          )
                        }
                        placeholder="Enter schedule title in Georgian"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-ka-${schedule.id}`}>
                        Description (Georgian)
                      </Label>
                      <MDXEditor
                        value={schedule.description[1]}
                        onChange={(value) =>
                          updateSchedule(schedule.id, "description", 1, value)
                        }
                        placeholder="Enter schedule description in Georgian"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="ru" className="space-y-4">
                    <div>
                      <Label htmlFor={`title-ru-${schedule.id}`}>
                        Title (Russian)
                      </Label>
                      <Input
                        id={`title-ru-${schedule.id}`}
                        value={schedule.title[2]}
                        onChange={(e) =>
                          updateSchedule(
                            schedule.id,
                            "title",
                            2,
                            e.target.value
                          )
                        }
                        placeholder="Enter schedule title in Russian"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-ru-${schedule.id}`}>
                        Description (Russian)
                      </Label>
                      <MDXEditor
                        value={schedule.description[2]}
                        onChange={(value) =>
                          updateSchedule(schedule.id, "description", 2, value)
                        }
                        placeholder="Enter schedule description in Russian"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {schedules.length === 0 && (
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
