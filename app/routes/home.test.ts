import { describe, it, expect, vi, beforeEach } from "vitest";
import * as HomeRoute from "./home";
import { TaskService } from "../services/task.server";

vi.mock("../services/task.server", () => ({
	TaskService: {
		getAllTasks: vi.fn(),
		createTask: vi.fn(),
		deleteTask: vi.fn(),
	},
}));

describe("Home Route", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("loads tasks from the service using defer", async () => {
		const mockTasks = [
			{ id: "1", title: "Mocked Task", createdAt: new Date() },
		];
		vi.mocked(TaskService.getAllTasks).mockResolvedValue(mockTasks);

		// FIX: Pass the expected object structure { request }
		const response = await HomeRoute.loader({
			request: new Request("http://localhost/"),
			params: {},
			context: {},
		} as any);

		const result = await response.data.tasks;

		expect(result).toEqual(mockTasks);
		expect(TaskService.getAllTasks).toHaveBeenCalledTimes(1);
	});

	it("calls the create service on action", async () => {
		const formData = new FormData();
		formData.append("intent", "create");
		formData.append("title", "New Task");
		const request = new Request("http://localhost/", {
			method: "POST",
			body: formData,
		});

		vi.mocked(TaskService.createTask).mockResolvedValue({
			success: true,
			data: {},
		});

		await HomeRoute.action({ request, params: {}, context: {} } as any);

		expect(TaskService.createTask).toHaveBeenCalledWith({ title: "New Task" });
	});
});
