import { Box, CircularProgress, Typography } from "@mui/material";
import { Suspense } from "react";
import {
	type ActionFunctionArgs,
	Await,
	data,
	type LoaderFunctionArgs,
	useLoaderData,
} from "react-router";
import { RouteErrorBoundary } from "../components/route-error-boundary";
import { TaskInputForm } from "../components/task-input-form";
import { TaskList } from "../components/task-list";
import { TaskListSkeleton } from "../components/task-list-skeleton";
import { TaskSchema } from "../models/task";
import { TaskService } from "../services/task.server";

export const ErrorBoundary = RouteErrorBoundary;

export function HydrateFallback() {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
			<CircularProgress />
		</Box>
	);
}

export async function loader(_args: LoaderFunctionArgs) {
	const tasksPromise = TaskService.getAllTasks();
	return data({ tasks: tasksPromise });
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = TaskSchema.safeParse(Object.fromEntries(formData));

	if (!submission.success) {
		// In production, you'd log this to an error tracking service
		return data({ errors: submission.error.flatten() }, { status: 400 });
	}

	const validData = submission.data;

	// Branching logic based on validated intent
	if (validData.intent === "create") {
		return await TaskService.createTask(validData);
	}

	if (validData.intent === "delete") {
		return await TaskService.deleteTask(validData.id);
	}

	throw new Response("Invalid Submission Logic", { status: 400 });
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
