"use client";

import { tourDataSchema } from "@/validation/tourSchema";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
type TourFormProps = {
  handleSubmit: (data: z.infer<typeof tourDataSchema>) => void;
  submitButtonLabel: React.ReactNode;
};
export default function TourForm({
  handleSubmit,
  submitButtonLabel,
}: TourFormProps) {
  const form = useForm<z.infer<typeof tourDataSchema>>({
    resolver: zodResolver(tourDataSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-4">
          <fieldset>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </fieldset>
        </div>
        <Button
          type="submit"
          variant="brandred"
          className="mx-auto mt-4  w-full"
        >
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
}
