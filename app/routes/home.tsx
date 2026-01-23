import { Box, Typography } from "@mui/material";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import { ListSkeleton } from "../lib/shared/ui/list-skeleton";
import { RouteErrorBoundary } from "../lib/shared/ui/route-error-boundary";
import { TaskInputForm } from "../lib/tasks/task-input-form";
import { TaskList } from "../lib/tasks/task-list";
import { homeAction, homeLoader } from "./home.server";

export const loader = homeLoader;
export const action = homeAction;
export const ErrorBoundary = RouteErrorBoundary;
export { HydrateFallback } from "../lib/shared/ui/hydrate-fallback";

export default function Home() {
	const { tasks } = useLoaderData<typeof loader>();

	return (
		<Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				sx={{ fontWeight: "bold" }}
			>
				My Tasks
			</Typography>

			<TaskInputForm />

			<Box sx={{ my: 4 }}>
				<Suspense fallback={<ListSkeleton />}>
					<Await resolve={tasks} errorElement={<p>Error loading tasks!</p>}>
						{(resolvedTasks) => <TaskList tasks={resolvedTasks} />}
					</Await>
				</Suspense>
			</Box>
		</Box>
	);
}
