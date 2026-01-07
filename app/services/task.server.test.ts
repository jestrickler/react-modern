import { describe, it, expect, beforeEach } from "vitest";
import { TaskService } from "./task.server";
import { db } from "../db.server";

// Helper to ensure different timestamps in fast-running tests
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

describe("TaskService", () => {
	beforeEach(async () => {
		await db.task.deleteMany();
	});

	it("creates a new task and returns a success result", async () => {
		const result = await TaskService.createTask({ title: "Write unit tests" });

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.title).toBe("Write unit tests");
			expect(result.data.id).toBeDefined();
		}
	});

	it("fetches all tasks in ascending order", async () => {
		await TaskService.createTask({ title: "Task 1" });
		// Wait 10ms to ensure a unique timestamp in SQLite
		await delay(10);
		await TaskService.createTask({ title: "Task 2" });

		const tasks = await TaskService.getAllTasks();
		expect(tasks.length).toBe(2);
		// Task 2 was created later, so it appears first in "ascending" order
		expect(tasks[0].title).toBe("Task 1");
	});

	it("deletes a task from the database", async () => {
		const createResult = await TaskService.createTask({ title: "Delete me" });

		if (createResult.success) {
			const id = createResult.data.id;
			const deleteResult = await TaskService.deleteTask(id);

			expect(deleteResult.success).toBe(true);

			const tasks = await TaskService.getAllTasks();
			expect(tasks.find((t) => t.id === id)).toBeUndefined();
		}
	});

	it("returns a failure result for invalid input", async () => {
		const result = await TaskService.createTask({ title: "no" });

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBeDefined();
		}
	});
});
