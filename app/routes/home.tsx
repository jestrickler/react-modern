import {
	data,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	Await,
	useLoaderData,
} from "react-router";
import { Suspense } from "react";
import { TaskService } from "../services/task.server";
import { TaskList } from "../components/task-list";
import { TaskInputForm } from "../components/task-input-form";
import { TaskListSkeleton } from "../components/task-list-skeleton";
import { RouteErrorBoundary } from "../components/route-error-boundary";
import { Box, Typography, CircularProgress } from "@mui/material";

export const ErrorBoundary = RouteErrorBoundary;

// This handles the "No HydrateFallback" warning.
// It renders during the very initial load before the JS has fully taken over.
export function HydrateFallback() {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
			<CircularProgress />
		</Box>
	);
}

export async function loader({ request }: LoaderFunctionArgs) {
	const tasksPromise = TaskService.getAllTasks();
	return data({ tasks: tasksPromise });
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "create") {
		const title = formData.get("title") as string;
		return await TaskService.createTask({ title });
	}

	if (intent === "delete") {
		const id = formData.get("id") as string;
		return await TaskService.deleteTask(id);
	}

	throw new Response("Unknown Intent", { status: 400 });
}

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
				<Suspense fallback={<TaskListSkeleton />}>
					<Await resolve={tasks} errorElement={<p>Error loading tasks!</p>}>
						{(resolvedTasks) => <TaskList tasks={resolvedTasks} />}
					</Await>
				</Suspense>
			</Box>
		</Box>
	);
}
