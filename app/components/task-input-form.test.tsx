import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { TaskInputForm } from "./task-input-form";

const mockSubmit = vi.fn();

vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useFetcher: () => ({
			Form: ({
				children,
				...props
			}: React.FormHTMLAttributes<HTMLFormElement>) => (
				<form
					{...props}
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						mockSubmit(formData);
					}}
				>
					{children}
				</form>
			),
			state: "idle",
			data: null,
		}),
	};
});

function renderWithRouter(ui: React.ReactElement) {
	const router = createMemoryRouter([{ path: "/", element: ui }], {
		initialEntries: ["/"],
	});
	return render(<RouterProvider router={router} />);
}

describe("TaskInputForm", () => {
	it("renders the input and submit button", () => {
		renderWithRouter(<TaskInputForm />);
		expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeDefined();
		expect(screen.getByRole("button", { name: /add/i })).toBeDefined();
	});

	it("submits the form with the correct data", () => {
		renderWithRouter(<TaskInputForm />);
		const input = screen.getByPlaceholderText(/what needs to be done/i);
		const button = screen.getByRole("button", { name: /add/i });

		fireEvent.change(input, { target: { value: "New Unit Test Task" } });
		fireEvent.click(button);

		expect(mockSubmit).toHaveBeenCalled();
		const formData = mockSubmit.mock.calls[0][0] as FormData;
		expect(formData.get("title")).toBe("New Unit Test Task");
	});
});
