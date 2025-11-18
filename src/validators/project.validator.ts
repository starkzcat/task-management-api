import z from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Project name is required")
      .max(100, "Project name too long")
      .trim(),
    description: z
      .string()
      .max(500, "Description too long")
      .optional()
      .nullable(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format (use #RRGGBB)")
      .optional()
      .nullable(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid project ID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "Project name is required")
      .max(100, "Project name too long")
      .trim(),
    description: z
      .string()
      .max(500, "Project name too long")
      .optional()
      .nullable(),
    color: z
      .string()
      .regex(/^[0-9A-Fa-f]{6}$/, "Invalid color format (use #RRGGBB)")
      .optional()
      .nullable(),
  }),
});

export const projectIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid project ID"),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];
