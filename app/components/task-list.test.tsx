import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskList } from "./task-list";
import { createMemoryRouter, RouterProvider } from "react-router";

const mockSubmit = vi.fn();

vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useFetchers: () => [], // Add empty fetchers array to support Optimistic UI filter
		useFetcher: () => ({
			Form: ({ children, ...props }: any) => (
				<form
					{...props}
					onSubmit={(e: any) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						const submitter = e.nativeEvent.submitter;
						if (submitter?.name)
							formData.append(submitter.name, submitter.value);
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

describe("TaskList Component", () => {
	it("renders a 'no tasks' message when the list is empty", () => {
		renderWithRouter(<TaskList tasks={[]} />);
		expect(screen.getByText(/no tasks yet/i)).toBeDefined();
	});

	it("renders the list of tasks provided in props", () => {
		const tasks = [{ id: "1", title: "Task 1" }];
		renderWithRouter(<TaskList tasks={tasks} />);
		expect(screen.getByText("Task 1")).toBeDefined();
	});

	it("submits the fetcher when the delete button is clicked", () => {
		const tasks = [{ id: "123", title: "Task to delete" }];
		renderWithRouter(<TaskList tasks={tasks} />);

		const deleteButton = screen.getByLabelText("delete");
		fireEvent.click(deleteButton);

		const formData = mockSubmit.mock.calls[0][0];
		expect(formData.get("id")).toBe("123");
		expect(formData.get("intent")).toBe("delete");
	});
});
