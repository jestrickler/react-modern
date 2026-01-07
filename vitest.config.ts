import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		include: ["app/**/*.{test,spec}.{ts,tsx}"],
		// This tells Vitest to run files one after another
		sequence: {
			concurrent: false,
		},
		// This disables parallel worker threads
		fileParallelism: false,
		env: {
			DATABASE_URL: "file:./test.db",
		},
	},
});
