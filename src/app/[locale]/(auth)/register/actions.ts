"use server";

import { auth, firestore } from "@/firebase/server";
import { registerUserSchema } from "@/validation/registerUser";
import { UserProfile } from "@/types/User";
import { z } from "zod";

export const registerUser = async (
  data: z.infer<typeof registerUserSchema>
) => {
  const validatedFields = registerUserSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    // Create the user account
    const userRecord = await auth.createUser({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      displayName: `${validatedFields.data.firstName} ${validatedFields.data.lastName}`,
    });

    // Create initial user profile
    const initialProfile: Partial<UserProfile> = {
      uid: userRecord.uid,
      email: validatedFields.data.email,
      firstName: validatedFields.data.firstName,
      lastName: validatedFields.data.lastName,
      phoneVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save the profile to Firestore
    await firestore
      .collection("userProfiles")
      .doc(userRecord.uid)
      .set(initialProfile);

    return { success: true };
  } catch (e: any) {
    if (e.code === "auth/email-already-in-use") {
      return { error: "Email already in use" };
    } else {
      return { error: "Failed to register user" };
    }
  }
};
