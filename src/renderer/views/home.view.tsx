import React from "react"
import { AccountBarComponent } from "./components/account-bar.component"
import { ReceiveDialog } from "./dialogs/receive.dialog"
import { TokenIcon } from "./components/token-icon.component"
import { INetworkState } from "renderer/store/reducers/network.reducer"
import { useSelector } from "react-redux"
import { Divider, IconButton, Tab, Tabs, Typography } from "@mui/material"
import CachedIcon from "@mui/icons-material/Cached"
import OutboundIcon from "@mui/icons-material/Outbound"
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"

export function HomeView() {
	const network: INetworkState = useSelector((s: any) => s.network)
	const [receiveDialog, setReceiveDialog] = React.useState(false)
	const [tab, setTab] = React.useState(0)

	return (
		<React.Fragment>
			<AccountBarComponent />
			<div style={{ padding: 6, flex: 1 }}>
				<Divider />
			</div>
			<ReceiveDialog open={receiveDialog} onClose={() => setReceiveDialog(false)} />
			<div className="flex-col-center p10">
				<TokenIcon symbol={network.current.token} style={{ width: 70, height: 70 }} />
				<Typography variant="h5" style={{ marginTop: 10 }}>
					0 {network.current.token}
				</Typography>
				<div
					style={{
						marginTop: 20,
						width: "100%",
						padding: 10,
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-evenly",
					}}
				>
					<div className="flex-col-center">
						<IconButton color="secondary" size="large" onClick={() => setReceiveDialog(true)}>
							<DownloadForOfflineIcon sx={{ width: 30, height: 30 }} />
						</IconButton>
						<Typography>Receive</Typography>
					</div>
					<div className="flex-col-center">
						<IconButton color="primary" size="large">
							<OutboundIcon sx={{ width: 30, height: 30 }} />
						</IconButton>
						<Typography>Send</Typography>
					</div>
					<div className="flex-col-center">
						<IconButton disabled color="primary" size="large">
							<CachedIcon sx={{ width: 30, height: 30 }} />
						</IconButton>
						<Typography>Swap</Typography>
					</div>
				</div>
			</div>
			<Tabs style={{ marginTop: 50 }} value={tab} variant="fullWidth" textColor="secondary">
				<Tab
					label={network.current.id != 56 && network.current.id != 97 ? "ERC-20 Tokens" : "BEP-20 Tokens"}
					onClick={() => setTab(0)}
				/>
				<Tab label="Transactions" onClick={() => setTab(1)} />
			</Tabs>
			<div style={{ width: "100%" }}>
				<Divider />
			</div>
		</React.Fragment>
	)
}
