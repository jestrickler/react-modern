import { describe, it, expect, vi, beforeEach } from "vitest";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { homeLoader, homeAction } from "./home.server";
import { TaskService } from "../lib/tasks/task.service";

// 1. Update mock path to the new Domain location
vi.mock("../lib/tasks/task.service", () => ({
	TaskService: {
		getAllTasks: vi.fn(),
		createTask: vi.fn(),
		deleteTask: vi.fn(),
	},
}));

describe("Home Server Controller", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("loader delegates to TaskService.getAllTasks", async () => {
		vi.mocked(TaskService.getAllTasks).mockResolvedValue([]);

		const args = {
			request: new Request("http://localhost"),
			params: {},
			context: {},
		} as unknown as LoaderFunctionArgs;

		const response = await homeLoader(args);

		expect(TaskService.getAllTasks).toHaveBeenCalled();
		expect(response.data.tasks).toBeDefined();
	});

	it("action delegates 'create' intent to TaskService", async () => {
		const formData = new FormData();
		formData.append("intent", "create");
		formData.append("title", "Test Task");

		const args = {
			request: new Request("http://localhost", {
				method: "POST",
				body: formData,
			}),
			params: {},
			context: {},
		} as unknown as ActionFunctionArgs;

		await homeAction(args);

		expect(TaskService.createTask).toHaveBeenCalledWith(
			expect.objectContaining({
				intent: "create",
				title: "Test Task",
			}),
		);
	});

	it("action delegates 'delete' intent to TaskService", async () => {
		const formData = new FormData();
		formData.append("intent", "delete");
		formData.append("id", "123");

		const args = {
			request: new Request("http://localhost", {
				method: "POST",
				body: formData,
			}),
			params: {},
			context: {},
		} as unknown as ActionFunctionArgs;

		await homeAction(args);

		expect(TaskService.deleteTask).toHaveBeenCalledWith("123");
	});
});
