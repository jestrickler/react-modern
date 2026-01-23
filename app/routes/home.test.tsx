import { render, screen, waitFor } from "@testing-library/react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home, { ErrorBoundary, loader } from "./home";

// Mock the Server Controller
vi.mock("./home.server", () => ({
	homeLoader: vi.fn(),
	homeAction: vi.fn(),
}));

import { homeLoader } from "./home.server";

describe("Home Route Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const renderHome = (path = "/") => {
		const router = createBrowserRouter([
			{
				path: "/",
				element: <Home />,
				loader: loader,
				// We include the ErrorBoundary in the test config to verify it catches crashes
				errorElement: <ErrorBoundary />,
			},
		]);
		return render(<RouterProvider router={router} />);
	};

	it("renders success state with tasks", async () => {
		const mockTasks = [{ id: "1", title: "Test Task", completed: false }];
		vi.mocked(homeLoader).mockResolvedValue({
			tasks: Promise.resolve(mockTasks),
		});

		renderHome();

		await waitFor(() => {
			expect(screen.getByText("Test Task")).toBeDefined();
		});
	});

	it("renders the 'Await' error element when task promise rejects", async () => {
		// This tests the errorElement prop on the <Await> component inside Home
		const rejectedPromise = Promise.reject(new Error("DB Down"));
		// Attach a catch handler to prevent unhandled rejection warning
		rejectedPromise.catch(() => {});

		vi.mocked(homeLoader).mockResolvedValue({
			tasks: rejectedPromise,
		});

		renderHome();

		await waitFor(() => {
			expect(screen.getByText(/Error loading tasks!/i)).toBeDefined();
		});
	});

	it("renders the Route ErrorBoundary when the loader itself throws", async () => {
		/** * This tests the framework-level ErrorBoundary.
		 * Note: We mock the loader to throw immediately, not return a rejected promise.
		 */
		vi.mocked(homeLoader).mockImplementation(() => {
			throw new Error("Critical Loader Failure");
		});

		// We suppress console.error for this test to keep the logs clean
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		renderHome();

		await waitFor(() => {
			// The RouteErrorBoundary shows this message for non-RouteErrorResponse errors
			expect(
				screen.getByText(
					/An unexpected error occurred while managing your tasks/i,
				),
			).toBeDefined();
		});

		consoleSpy.mockRestore();
	});
});
