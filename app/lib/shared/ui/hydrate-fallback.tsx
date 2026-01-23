import { Box, CircularProgress } from "@mui/material";

export function HydrateFallback() {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
			<CircularProgress />
		</Box>
	);
}
