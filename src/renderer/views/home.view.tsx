import React from "react"
import { AccountBarComponent } from "./components/account-bar.component"
import { ReceiveDialog } from "./dialogs/receive.dialog"
import { TokenIcon } from "./components/token-icon.component"
import { INetworkState } from "renderer/store/reducers/network.reducer"
import { useSelector } from "react-redux"
import { IconButton, Typography } from "@mui/material"
import CachedIcon from "@mui/icons-material/Cached"
import OutboundIcon from "@mui/icons-material/Outbound"
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"

export function HomeView() {
	const network: INetworkState = useSelector((s: any) => s.network)
	const [receiveDialog, setReceiveDialog] = React.useState(false)
	return (
		<React.Fragment>
			<AccountBarComponent />
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
		</React.Fragment>
	)
}
