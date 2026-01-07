import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, expect } from "vitest";
import { prisma } from "./app/db.server"; // Match the named export

expect.extend(matchers);

beforeEach(async () => {
	// Clean the database before every test to ensure isolation
	await prisma.task.deleteMany();
});

afterEach(() => {
	cleanup();
});
