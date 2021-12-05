import { Typography } from "@mui/material"
import { MemoryRouter as Router, Switch, Route } from "react-router-dom"
import { GreetingView } from "./views/greeting.view"
import { SetPasswordView } from "./views/set-password.view"
import { theme } from "./theme"

const loggedIn = false
const passwordSet = false
document.body.style.backgroundColor = theme.palette.background.default

export function AppLayout() {
	return !passwordSet ? (
		<SetPasswordView />
	) : loggedIn ? (
		<Router>
			<Switch>
				<Route path="/" component={() => <Typography variant="h3">Welcome!!!</Typography>} />
			</Switch>
		</Router>
	) : (
		<GreetingView />
	)
}
