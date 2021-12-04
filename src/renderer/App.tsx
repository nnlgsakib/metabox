import React from "react"
import { MemoryRouter as Router, Switch, Route } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import "./App.css"
import { theme } from "./theme"
import { Paper, Typography } from "@mui/material"
import { GreetingView } from "./views/greeting.view"

document.body.style.backgroundColor = theme.palette.background.default

const Hello = () => {
	return (
		<Paper>
			<Typography variant="h3">Hello world</Typography>
		</Paper>
	)
}
export default function App() {
	const loggedIn = false
	return (
		<ThemeProvider theme={theme}>
			{loggedIn ? (
				<Router>
					<Switch>
						<Route path="/" component={Hello} />
					</Switch>
				</Router>
			) : (
				<GreetingView />
			)}
		</ThemeProvider>
	)
}
