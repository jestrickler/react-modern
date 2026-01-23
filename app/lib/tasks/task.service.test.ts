import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../shared/db.server"; // Named export
import { TaskService } from "./task.service";

describe("TaskService", () => {
	beforeEach(async () => {
		// Clean database using the correct prisma instance
		await prisma.task.deleteMany();
	});

	it("creates a new task and returns a success result", async () => {
		const data = { title: "Test Task", intent: "create" as const };
		const task = await TaskService.createTask(data);

		expect(task.title).toBe("Test Task");
		expect(task.id).toBeDefined();
		expect(task.createdAt).toBeInstanceOf(Date);
	});

	it("fetches all tasks in ascending order", async () => {
		await TaskService.createTask({ title: "Task A", intent: "create" });
		await TaskService.createTask({ title: "Task B", intent: "create" });

		const tasks = await TaskService.getAllTasks();
		expect(tasks.length).toBe(2);
	});

	it("deletes a task from the database", async () => {
		const task = await TaskService.createTask({
			title: "To Delete",
			intent: "create",
		});
		await TaskService.deleteTask(task.id);

		const count = await prisma.task.count();
		expect(count).toBe(0);
	});
});
