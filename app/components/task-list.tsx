import DeleteIcon from "@mui/icons-material/Delete";
import {
	Checkbox,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";
import { useFetcher } from "react-router";
import type { TaskResult } from "../models/task";

interface TaskListProps {
	tasks: TaskResult[];
}

export function TaskList({ tasks }: TaskListProps) {
	const fetcher = useFetcher();

	if (tasks.length === 0) {
		return (
			<Typography
				variant="body1"
				color="text.secondary"
				sx={{ textAlign: "center", mt: 4 }}
			>
				No tasks yet. Add one above!
			</Typography>
		);
	}

	return (
		<List>
			{tasks.map((task) => (
				<ListItem
					key={task.id}
					secondaryAction={
						<fetcher.Form method="post">
							{/* These inputs ensure the Action receives the data Zod expects */}
							<input type="hidden" name="id" value={task.id} />
							<input type="hidden" name="intent" value="delete" />
							<IconButton
								edge="end"
								aria-label="delete"
								type="submit"
								disabled={fetcher.state !== "idle"}
							>
								<DeleteIcon />
							</IconButton>
						</fetcher.Form>
					}
				>
					<Checkbox edge="start" disableRipple />
					<ListItemText primary={task.title} />
				</ListItem>
			))}
		</List>
	);
}
