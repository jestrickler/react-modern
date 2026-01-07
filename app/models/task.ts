import type { Task } from "@prisma/client";
import { z } from "zod";

/**
 * Single source of truth for Task validation.
 * Uses discriminated unions so TypeScript knows exactly which fields are required.
 */
const CreateTaskSchema = z.object({
	intent: z.literal("create"),
	title: z.string().trim().min(1, "Title is required").max(100),
});

const DeleteTaskSchema = z.object({
	intent: z.literal("delete"),
	id: z.string(),
});

export const TaskSchema = z.discriminatedUnion("intent", [
	CreateTaskSchema,
	DeleteTaskSchema,
]);

export type TaskInput = z.infer<typeof TaskSchema>;
export type TaskResult = Task;
