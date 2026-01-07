import { prisma } from "../db.server";
import type { TaskInput, TaskResult } from "../models/task";

export const TaskService = {
	async getAllTasks(): Promise<TaskResult[]> {
		// Prisma returns the 'createdAt' field automatically
		return prisma.task.findMany({
			orderBy: { createdAt: "asc" },
		});
	},

	async createTask(
		data: Extract<TaskInput, { intent: "create" }>,
	): Promise<TaskResult> {
		return prisma.task.create({
			data: {
				title: data.title,
			},
		});
	},

	async deleteTask(id: string): Promise<TaskResult> {
		return prisma.task.delete({
			where: { id },
		});
	},
};
