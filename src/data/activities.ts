import "server-only";
import { firestore } from "../firebase/server";
import { ActivityType } from "@/types/Activity";

const ACTIVITIES_MASTER_COLLECTION = "activities_master";

/**
 * Fetches all activity types from the activities_master collection.
 * @returns {Promise<ActivityType[]>} A promise that resolves to an array of activity types.
 */
export async function getAllActivityTypes(): Promise<ActivityType[]> {
  try {
    const snapshot = await firestore
      .collection(ACTIVITIES_MASTER_COLLECTION)
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as ActivityType)
    );
  } catch (error) {
    console.error("Error fetching all activity types:", error);
    throw new Error("Failed to fetch activity types.");
  }
}

/**
 * Fetches a single activity type by its ID from the activities_master collection.
 * @param {string} activityTypeId - The ID of the activity type to fetch.
 * @returns {Promise<ActivityType | null>} A promise that resolves to the activity type or null if not found.
 */
export async function getActivityTypeById(
  activityTypeId: string
): Promise<ActivityType | null> {
  try {
    const doc = await firestore
      .collection(ACTIVITIES_MASTER_COLLECTION)
      .doc(activityTypeId)
      .get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as ActivityType;
  } catch (error) {
    console.error(
      `Error fetching activity type with ID ${activityTypeId}:`,
      error
    );
    throw new Error("Failed to fetch activity type.");
  }
}

/**
 * Creates a new activity type in the activities_master collection.
 * @param {Omit<ActivityType, "id">} activityTypeData - The data for the new activity type (without id).
 * @returns {Promise<ActivityType>} A promise that resolves to the newly created activity type with its ID.
 */
export async function createActivityType(
  activityTypeData: Omit<ActivityType, "id">
): Promise<ActivityType> {
  try {
    const docRef = await firestore
      .collection(ACTIVITIES_MASTER_COLLECTION)
      .add(activityTypeData);
    return { id: docRef.id, ...activityTypeData } as ActivityType;
  } catch (error) {
    console.error("Error creating activity type:", error);
    throw new Error("Failed to create activity type.");
  }
}

/**
 * Updates an existing activity type in the activities_master collection.
 * @param {string} activityTypeId - The ID of the activity type to update.
 * @param {Partial<Omit<ActivityType, "id">>} activityTypeData - The partial data to update.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export async function updateActivityType(
  activityTypeId: string,
  activityTypeData: Partial<Omit<ActivityType, "id">>
): Promise<void> {
  try {
    await firestore
      .collection(ACTIVITIES_MASTER_COLLECTION)
      .doc(activityTypeId)
      .update(activityTypeData);
  } catch (error) {
    console.error(
      `Error updating activity type with ID ${activityTypeId}:`,
      error
    );
    throw new Error("Failed to update activity type.");
  }
}

/**
 * Deletes an activity type from the activities_master collection.
 * @param {string} activityTypeId - The ID of the activity type to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteActivityType(
  activityTypeId: string
): Promise<void> {
  try {
    await firestore
      .collection(ACTIVITIES_MASTER_COLLECTION)
      .doc(activityTypeId)
      .delete();
  } catch (error) {
    console.error(
      `Error deleting activity type with ID ${activityTypeId}:`,
      error
    );
    throw new Error("Failed to delete activity type.");
  }
}
