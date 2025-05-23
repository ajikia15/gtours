"use server";

import { auth } from "@/firebase/server";
import { registerUserSchema } from "@/validation/registerUser";
import { z } from "zod";

export const registerUser = async (
  data: z.infer<typeof registerUserSchema>
) => {
  const validatedFields = registerUserSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    await auth.createUser({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      displayName: `${validatedFields.data.firstName} ${validatedFields.data.lastName}`,
    });
  } catch (e: any) {
    if (e.code === "auth/email-already-in-use") {
      return { error: "Email already in use" };
    } else {
      return { error: "Failed to register user" };
    }
  }
};
