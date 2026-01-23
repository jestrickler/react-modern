import {
	type ActionFunctionArgs,
	data,
	type LoaderFunctionArgs,
} from "react-router";
import { TaskSchema } from "../lib/tasks/task.schema";
import { TaskService } from "../lib/tasks/task.service";

export async function homeAction({ request }: ActionFunctionArgs) {
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

export async function homeLoader(_args: LoaderFunctionArgs) {
	const tasksPromise = TaskService.getAllTasks();
	return data({ tasks: tasksPromise });
}
