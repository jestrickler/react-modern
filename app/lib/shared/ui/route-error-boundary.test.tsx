import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { RouteErrorBoundary } from "./route-error-boundary";

describe("RouteErrorBoundary Component", () => {
	it("renders the error alert and retry button when a route crashes", async () => {
		const errorMessage = "Critical Database Failure";

		const routes = [
			{
				path: "/",
				loader: () => {
					throw new Error(errorMessage);
				},
				// Adding a fallback silences the stderr warning
				HydrateFallback: () => <div>Loading...</div>,
				errorElement: <RouteErrorBoundary />,
				element: <div>Happy Path</div>,
			},
		];

		// Explicitly enabling hydration data to satisfy the router lifecycle
		const router = createMemoryRouter(routes, {
			initialEntries: ["/"],
			hydrationData: {},
		});

		render(<RouterProvider router={router} />);

		// Verify the "Sad Path" UI is visible
		const alertTitle = await screen.findByText(/application error/i);
		expect(alertTitle).toBeDefined();

		const description = screen.getByText(/unexpected error occurred/i);
		expect(description).toBeDefined();

		const retryButton = screen.getByRole("button", { name: /retry/i });
		expect(retryButton).toBeDefined();

		expect(screen.queryByText(/happy path/i)).toBeNull();
	});
});
