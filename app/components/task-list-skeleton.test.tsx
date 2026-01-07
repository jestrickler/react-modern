import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TaskListSkeleton } from "./task-list-skeleton";

describe("TaskListSkeleton", () => {
	it("renders the correct number of skeleton items", () => {
		const { container } = render(<TaskListSkeleton />);
		// We expect 3 skeletons based on our component definition
		const skeletons = container.querySelectorAll(".MuiSkeleton-root");
		expect(skeletons.length).toBe(3);
	});
});
