import { Box, Button, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";

export function TaskInputForm() {
	const fetcher = useFetcher();
	const formRef = useRef<HTMLFormElement>(null);

	// Determine state
	const isSubmitting = fetcher.state === "submitting";
	const isDone = fetcher.state === "idle" && fetcher.data;

	// Production Pattern: Explicit synchronization with the fetcher state
	useEffect(() => {
		if (isDone) {
			formRef.current?.reset();
			// Optional: Refocus the input for better UX after reset
			(
				formRef.current?.elements.namedItem("title") as HTMLInputElement
			)?.focus();
		}
	}, [isDone]);

	return (
		<fetcher.Form method="post" ref={formRef}>
			<Box sx={{ display: "flex", gap: 1 }}>
				<TextField
					name="title"
					placeholder="What needs to be done?"
					variant="outlined"
					fullWidth
					size="small"
					disabled={isSubmitting}
					required
					autoComplete="off"
					sx={{
						"& .MuiOutlinedInput-root": {
							backgroundColor: "rgba(255, 255, 255, 0.05)",
						},
					}}
				/>
				<Button
					type="submit"
					name="intent"
					value="create"
					variant="contained"
					disabled={isSubmitting}
					sx={{ minWidth: 100 }}
				>
					{isSubmitting ? "Adding..." : "Add"}
				</Button>
			</Box>
		</fetcher.Form>
	);
}
