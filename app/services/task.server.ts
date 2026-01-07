// app/services/task.server.ts
import { db } from "../db.server";
import { z } from "zod";

export const TaskSchema = z.object({
	title: z.string().min(3, "Task must be at least 3 characters long"),
});

export type TaskInput = z.infer<typeof TaskSchema>;

export type ServiceResponse<T> =
	| { success: true; data: T }
	| { success: false; error: string };

export const TaskService = {
	async getAllTasks() {
		return db.task.findMany({ orderBy: { createdAt: "asc" } });
	},

	async createTask(data: TaskInput): Promise<ServiceResponse<any>> {
		const result = TaskSchema.safeParse(data);

		if (!result.success) {
			// flatten() returns a more predictable structure for error messages
			const fieldErrors = result.error.flatten().fieldErrors;
			const message = fieldErrors.title?.[0] || "Invalid input";
			return { success: false, error: message };
		}

		try {
			const task = await db.task.create({ data: result.data });
			return { success: true, data: task };
		} catch (e) {
			return { success: false, error: "Database failure" };
		}
	},

	async deleteTask(id: string) {
		try {
			await db.task.delete({ where: { id } });
			return { success: true };
		} catch (e) {
			return { success: false, error: "Could not delete task" };
		}
	},
};
