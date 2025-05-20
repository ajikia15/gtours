"use client";

import { useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { MoveIcon, Trash, Upload, XIcon } from "lucide-react";
import Image from "next/image";
export type ImageUpload = {
  id: string;
  url: string;
  file?: File;
};
type Props = {
  images?: ImageUpload[];
  onImagesChange: (images: ImageUpload[]) => void;
  urlFormatter?: (image: ImageUpload) => string;
};
export default function MultiImageUploader({
  images = [],
  onImagesChange,
  urlFormatter = (image: ImageUpload) => image.url,
}: Props) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file, index) => {
      return {
        id: `${Date.now()}-${index}-${file.name}`,
        url: URL.createObjectURL(file),
        file: file,
      };
    });

    onImagesChange([...images, ...newImages]);
  };
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(images);
    const [reorderedImage] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedImage);

    onImagesChange(items);
  };

  const handleDeleteImage = (id: string) => {
    const updatedImages = images.filter((image) => image.id !== id);
    onImagesChange(updatedImages);
  };
  return (
    <div className="w-full max-w-3xl mx-auto">
      <input
        className="hidden"
        ref={uploadInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
      />
      <Button
        className="w-full"
        variant="default"
        type="button"
        onClick={() => uploadInputRef?.current?.click()}
      >
        <Upload className="mr-2" />
        Upload Images
      </Button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="property-images" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="relative p-2"
                    >
                      <div className="border border-gray-200 rounded-lg flex gap-2 items-center overflow-hidden">
                        <div className="size-16 relative">
                          <Image
                            src={urlFormatter ? urlFormatter(image) : image.url}
                            alt=""
                            width={200}
                            height={200}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium">
                            Image {index + 1}
                          </p>
                          {index === 0 && (
                            <Badge variant="outline">Featured Image</Badge>
                          )}
                        </div>
                        <div className="flex items-center p-2">
                          <button
                            className="text-red-400 p-2 cursor-pointer"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <Trash />
                          </button>
                          <div className="text-gray-500">
                            <MoveIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
