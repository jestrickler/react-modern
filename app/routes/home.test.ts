import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { TaskService } from "../services/task.server";
import * as HomeRoute from "./home";

vi.mock("../services/task.server", () => ({
	TaskService: {
		getAllTasks: vi.fn(),
		createTask: vi.fn(),
	},
}));

describe("Home Route", () => {
	it("loads tasks from the service using defer", async () => {
		vi.mocked(TaskService.getAllTasks).mockResolvedValue([]);

		// We cast to LoaderFunctionArgs to satisfy the missing 'unstable_pattern'
		const args = {
			request: new Request("http://localhost"),
			params: {},
			context: {},
		} as unknown as LoaderFunctionArgs;

		const response = await HomeRoute.loader(args);
		// Since we use 'data()' helper, we check .data
		expect(response.data.tasks).toBeDefined();
	});

	it("calls the create service on action", async () => {
		const formData = new FormData();
		formData.append("intent", "create");
		formData.append("title", "New Task");

		const request = new Request("http://localhost", {
			method: "POST",
			body: formData,
		});

		const args = {
			request,
			params: {},
			context: {},
		} as unknown as ActionFunctionArgs;

		await HomeRoute.action(args);

		expect(TaskService.createTask).toHaveBeenCalledWith({
			intent: "create",
			title: "New Task",
		});
	});
});
