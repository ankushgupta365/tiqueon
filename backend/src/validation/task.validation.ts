import { z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum, TaskTypeEnum } from "../enums/task.enum";

export const titleSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();

export const assignedToSchema = z.string().trim().min(1).nullable().optional();

export const prioritySchema = z.enum(
  Object.values(TaskPriorityEnum) as [string, ...string[]]
);

export const typeSchema = z.enum(
  Object.values(TaskTypeEnum) as [string, ...string[]]
)

export const statusSchema = z.enum(
  Object.values(TaskStatusEnum) as [string, ...string[]]
);

export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      return !val || !isNaN(Date.parse(val));
    },
    {
      message: "Invalid date format. Please provide a valid date string.",
    }
  );

export const taskIdSchema = z.string().trim().min(1);

export const fileSchema = z.object({
  filename: z.string().min(1),
  fileUrl: z.string().url(),
  fileType: z.string().min(1),
  fileSize: z.number().nonnegative(), // Allows 0 or positive numbers
  project: z.string().optional(),
  workspace: z.string().optional(),
  initial: z.boolean().optional(),
});

export const filesSchema = z.array(z.any()).default([]);
export const participantsSchema = z.array(z.string()).optional();



export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  files: filesSchema,
  priority: prioritySchema,
  type: typeSchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});
