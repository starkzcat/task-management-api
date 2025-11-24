import { TaskPriority, TaskStatus } from "@prisma/client";
import z from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Task title is required")
      .max(200, "Title too long")
      .trim(),
    description: z
      .string()
      .max(2000, "Description too long")
      .optional()
      .nullable(),
    status: z.enum(TaskStatus).optional().default(TaskStatus.TODO),
    priority: z.enum(TaskPriority).optional().default(TaskPriority.MEDIUM),
    dueDate: z
      .date("Invalid date format")
      .optional()
      .nullable()
      .transform((val) => (val ? new Date(val) : null)),
    projectId: z.uuid("Invalid project ID").optional().nullable(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid task ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title too long")
      .trim(),
    description: z
      .string()
      .max(2000, "Description too long")
      .optional()
      .nullable(),
    status: z.enum(TaskStatus).optional(),
    priority: z.enum(TaskPriority).optional(),
    dueDate: z
      .date("Invalid date format")
      .optional()
      .nullable()
      .transform((val) => (val ? new Date(val) : null)),
    projectId: z.uuid("Invalid project ID").optional().nullable(),
  }),
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid task ID"),
  }),
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    status: z.enum(TaskStatus).optional(),
    priority: z.enum(TaskPriority).optional(),
    projectId: z.uuid().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
    sortBy: z
      .enum(["createdAt", "updatedAt", "dueDate", "priority", "status"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    search: z.string().optional(),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>["query"];
