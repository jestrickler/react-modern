import { Box, Skeleton } from "@mui/material";

export function ListSkeleton() {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
			<Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
			<Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
			<Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
		</Box>
	);
}
