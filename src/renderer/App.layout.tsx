import { Typography } from "@mui/material"
import { MemoryRouter as Router, Switch, Route } from "react-router-dom"
import { GreetingView } from "./views/greeting.view"
import { SetPasswordView } from "./views/set-password.view"
import { theme } from "./theme"
import { useSelector } from "react-redux"
import { IAuthState } from "./store/reducers/auth.reducer"
import { LoginView } from "./views/login.view"

document.body.style.backgroundColor = theme.palette.background.default

export function AppLayout() {
	const auth: IAuthState = useSelector((s: any) => s.auth)
	const walletsCount: number = useSelector((s: any) => s.wallets.length)

	return !auth.passwordHash ? (
		<SetPasswordView />
	) : auth.password ? (
		walletsCount > 0 ? (
			<Router>
				<Switch>
					<Route path="/" component={() => <Typography variant="h3">Welcome!!!</Typography>} />
				</Switch>
			</Router>
		) : (
			<GreetingView />
		)
	) : (
		<LoginView />
	)
}
