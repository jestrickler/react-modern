import { useFetcher, useFetchers } from "react-router";
import {
	List,
	ListItem,
	ListItemText,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Task {
	id: string;
	title: string;
}

interface TaskListProps {
	tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
	const fetchers = useFetchers();

	// Optimistic UI for new tasks
	const optimisticTasks = fetchers
		.filter((f) => f.formData?.get("intent") === "create")
		.map((f) => ({
			id: `optimistic-${Math.random()}`,
			title: f.formData?.get("title") as string,
			isOptimistic: true,
		}));

	const allTasks = [...tasks, ...optimisticTasks];

	if (allTasks.length === 0) {
		return (
			<Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
				No tasks yet. Add one above!
			</Typography>
		);
	}

	return (
		<List>
			{allTasks.map((task) => {
				const isDeleting = fetchers.some(
					(f) =>
						f.formData?.get("id") === task.id &&
						f.formData?.get("intent") === "delete",
				);

				if (isDeleting) return null;

				return (
					<Paper
						key={task.id}
						elevation={1}
						sx={{
							mb: 1,
							opacity: (task as any).isOptimistic ? 0.5 : 1,
							fontStyle: (task as any).isOptimistic ? "italic" : "normal",
						}}
					>
						<ListItem
							secondaryAction={
								!(task as any).isOptimistic && <DeleteAction id={task.id} />
							}
						>
							<ListItemText primary={task.title} />
						</ListItem>
					</Paper>
				);
			})}
		</List>
	);
}

function DeleteAction({ id }: { id: string }) {
	const fetcher = useFetcher();
	return (
		<fetcher.Form method="post">
			<input type="hidden" name="id" value={id} />
			<IconButton
				edge="end"
				type="submit"
				name="intent"
				value="delete"
				color="error"
				aria-label="delete" /* restored label */
			>
				<DeleteIcon />
			</IconButton>
		</fetcher.Form>
	);
}
