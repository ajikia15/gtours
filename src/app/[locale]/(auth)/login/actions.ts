"use server";

import { loginUserSchema } from "@/validation/loginUser";
import { z } from "zod";

export const loginUser = async (data: z.infer<typeof loginUserSchema>) => {
  const validatedFields = loginUserSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    // Note: Firebase Admin SDK doesn't have signInWithEmailAndPassword
    // This would typically be handled on the client side with Firebase Auth
    // For now, we'll return a placeholder response
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to login user" };
  }
};
