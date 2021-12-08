import React from "react"
import { Button, Typography } from "@mui/material"
import "./greeting.style.css"
import AddBoxIcon from "@mui/icons-material/AddBox"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { CreateNewWalletComponent } from "./components/create-new-wallet.component"

export function GreetingView() {
	const [view, setView] = React.useState(0)

	switch (view) {
		case 1:
			return <CreateNewWalletComponent setView={setView} />
		case 2:
			return <div></div>
	}

	return (
		<div className="flex-col-center greetingLayout">
			<div className="p10">
				<Typography align="center" variant="h4">
					Welcome to MetaBox
				</Typography>
				<Button
					size="large"
					variant="contained"
					color="primary"
					fullWidth
					style={{ marginTop: 50 }}
					onClick={() => setView(1)}
				>
					<AddBoxIcon sx={{ fontSize: 25 }} style={{ marginRight: 10 }} />
					Create new wallet
				</Button>
				<Button size="large" variant="outlined" color="secondary" fullWidth style={{ marginTop: 20 }}>
					<AccountBalanceWalletIcon sx={{ fontSize: 25 }} style={{ marginRight: 10 }} />
					Import existing wallet
				</Button>
			</div>
		</div>
	)
}
