import { Button, Typography } from "@mui/material"
import "./greeting.style.css"
import AddBoxIcon from "@mui/icons-material/AddBox"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"

export function GreetingView() {
	return (
		<div className="flex-col-center greetingLayout">
			<div className="p10">
				<Typography align="center" variant="h4">
					Welcome to MetaWallet
				</Typography>
				<Button size="large" variant="contained" color="primary" fullWidth style={{ marginTop: 50 }}>
					<AddBoxIcon sx={{ fontSize: 40 }} style={{ marginRight: 10 }} />
					Create new wallet
				</Button>
				<Button size="large" variant="outlined" color="secondary" fullWidth style={{ marginTop: 20 }}>
					<AccountBalanceWalletIcon sx={{ fontSize: 40 }} style={{ marginRight: 10 }} />
					Import existing wallet
				</Button>
			</div>
		</div>
	)
}
