import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name too long")
      .trim(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
