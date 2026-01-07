// vitest.setup.ts
import { execSync } from "node:child_process";
import { db } from "./app/db.server";

export default async function setup() {
	// Initialize the test database schema
	execSync("npx prisma db push --force-reset", {
		env: { ...process.env, DATABASE_URL: "file:./test.db" },
	});
}

// Global cleanup after each test to ensure no data leaks between service tests
import { beforeEach } from "vitest";
beforeEach(async () => {
	await db.task.deleteMany();
});
