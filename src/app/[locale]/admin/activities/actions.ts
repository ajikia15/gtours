"use server";

import { revalidatePath } from "next/cache";
import {
  createActivityType,
  updateActivityType as updateActivityTypeDataLayer,
} from "@/data/activities";
import { ActivityType } from "@/types/Activity";
import { activityTypeSchema } from "@/validation/activityTypeSchema";
import { z } from "zod";

export async function saveNewActivityType(
  data: z.infer<typeof activityTypeSchema>,
  token: string,
  locale: string
) {
  try {
    const validationResult = activityTypeSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        error: "Invalid data format.",
        details: validationResult.error.flatten(),
        success: false,
      };
    }

    const newActivityType = await createActivityType(validationResult.data);
    revalidatePath(`/${locale}/admin/activities`);
    revalidatePath(`/${locale}/admin`);
    return { success: true, activityTypeId: newActivityType.id };
  } catch (error) {
    console.error("Error saving new activity type:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      error: `Failed to save activity type: ${errorMessage}`,
      success: false,
    };
  }
}

export async function updateExistingActivityType(
  activityTypeId: string,
  data: Partial<Omit<ActivityType, "id">>,
  token: string,
  locale: string
) {
  try {
    if (data.name !== undefined && data.name.trim() === "") {
      return { error: "Activity name cannot be empty.", success: false };
    }

    await updateActivityTypeDataLayer(activityTypeId, data);
    revalidatePath(`/${locale}/admin/activities`);
    revalidatePath(`/${locale}/admin/activities/edit/${activityTypeId}`);
    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch (error) {
    console.error(`Error updating activity type ${activityTypeId}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      error: `Failed to update activity type: ${errorMessage}`,
      success: false,
    };
  }
}
