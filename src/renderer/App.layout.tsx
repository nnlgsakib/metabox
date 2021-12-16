import React from "react"
import { CssBaseline, Grid, Theme, ThemeProvider } from "@mui/material"
import { MemoryRouter as Router, Switch, Route } from "react-router-dom"
import { GreetingView } from "./views/greeting.view"
import { SetPasswordView } from "./views/set-password.view"
import { darkTheme, lightTheme } from "./theme"
import { useDispatch, useSelector } from "react-redux"
import { IAuthState } from "./store/reducers/auth.reducer"
import { LoginView } from "./views/login.view"
import { HomeView } from "./views/home.view"
import { HomeHeaderComponent } from "./views/components/home-header.component"
import { IWalletsState, WalletsAction } from "./store/reducers/wallets.reducer"
import { ISettingsState } from "./store/reducers/settings.reducer"
import { ITxRequestState } from "./store/reducers/tx-request.reducer"
import { TransactionView } from "./views/transaction.view"

export function AppLayout() {
	const auth: IAuthState = useSelector((s: any) => s.auth)
	const wallets: IWalletsState = useSelector((s: any) => s.wallets)
	const settings: ISettingsState = useSelector((s: any) => s.settings)
	const txRequest: ITxRequestState = useSelector((s: any) => s.txRequest)
	const [theme, setTheme] = React.useState<Theme>(lightTheme)

	React.useEffect(() => {
		const _theme = settings.theme == "dark" ? darkTheme : lightTheme
		setTheme(_theme)
	}, [settings.theme])

	const dispatch = useDispatch()
	if (wallets.list.length > 0 && (!wallets.selectedWallet || !wallets.selectedAccount)) {
		dispatch({ type: WalletsAction.SelectWallet, walletId: wallets.list[0].id })
		return null
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{!auth.passwordHash ? (
				<SetPasswordView />
			) : auth.password ? (
				wallets.list.length > 0 ? (
					txRequest.transactions.length > 0 ? (
						<TransactionView txRequest={txRequest} />
					) : (
						<React.Fragment>
							<HomeHeaderComponent />
							<Grid container justifyContent="center">
								<Grid item xs={12} sm={9} md={6}>
									<Router>
										<Switch>
											<Route path="/" component={HomeView} />
										</Switch>
									</Router>
								</Grid>
							</Grid>
						</React.Fragment>
					)
				) : (
					<GreetingView />
				)
			) : (
				<LoginView />
			)}
		</ThemeProvider>
	)
}
