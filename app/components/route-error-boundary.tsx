import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function RouteErrorBoundary() {
	const error = useRouteError();

	return (
		<Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
			<Alert
				severity="error"
				variant="filled"
				action={
					<Button
						color="inherit"
						size="small"
						onClick={() => window.location.reload()}
					>
						RETRY
					</Button>
				}
			>
				<AlertTitle>
					{isRouteErrorResponse(error)
						? `${error.status} ${error.statusText}`
						: "Application Error"}
				</AlertTitle>
				{isRouteErrorResponse(error)
					? "The task service encountered a problem. Please try again."
					: "An unexpected error occurred while managing your tasks."}
			</Alert>
		</Box>
	);
}
