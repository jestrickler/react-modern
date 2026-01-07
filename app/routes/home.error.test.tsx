import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { TaskService } from "../services/task.server";
// Import HydrateFallback along with Home and loader
import Home, { HydrateFallback, loader } from "./home";

vi.mock("../services/task.server", () => ({
	TaskService: {
		getAllTasks: vi.fn(),
	},
}));

describe("Home Route Error Handling", () => {
	it("renders the localized error message when the task streaming fails", async () => {
		vi.mocked(TaskService.getAllTasks).mockRejectedValue(
			new Error("Database Connection Failed"),
		);

		const routes = [
			{
				path: "/",
				loader: loader,
				// You must explicitly provide HydrateFallback here for the test router
				HydrateFallback: HydrateFallback,
				element: <Home />,
			},
		];

		// Added hydration: true to fully simulate the production lifecycle
		const router = createMemoryRouter(routes, {
			initialEntries: ["/"],
			hydrationData: {},
		});

		render(<RouterProvider router={router} />);

		const errorMsg = await screen.findByText(/error loading tasks!/i);

		expect(errorMsg).toBeDefined();
		expect(screen.getByText(/my tasks/i)).toBeDefined();
	});
});
