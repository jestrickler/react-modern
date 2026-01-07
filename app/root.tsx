import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

// Create a dark theme instance
const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<ThemeProvider theme={darkTheme}>
					{/* CssBaseline kicks in to normalize styles and set background colors */}
					<CssBaseline />
					<Outlet />
				</ThemeProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
