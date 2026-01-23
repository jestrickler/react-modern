import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListSkeleton } from "./list-skeleton";

describe("TaskListSkeleton", () => {
	it("renders the correct number of skeleton items", () => {
		const { container } = render(<ListSkeleton />);
		// We expect 3 skeletons based on our component definition
		const skeletons = container.querySelectorAll(".MuiSkeleton-root");
		expect(skeletons.length).toBe(3);
	});
});
