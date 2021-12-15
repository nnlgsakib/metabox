import React from "react"
import { INetworkState } from "renderer/store/reducers/network.reducer"
import { useSelector } from "react-redux"
import { AppBar, Button, IconButton, Toolbar, Tooltip, Typography } from "@mui/material"
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { TokenIcon } from "./components/token-icon.component"

export function TransactionView() {
	const network: INetworkState = useSelector((s: any) => s.network)

	return (
		<div>
			<AppBar variant="outlined" position="static" color="transparent">
				<Toolbar variant="dense">
					<Tooltip title="Previous" arrow>
						<IconButton size="small">
							<ArrowBackIosNewIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Typography style={{ margin: "0 10px 0 10px" }}>2 of 10</Typography>
					<Tooltip title="Next" arrow>
						<IconButton size="small">
							<ArrowForwardIosIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<div style={{ flex: 1, justifyContent: "flex-end", display: "flex" }}>
						<Button size="small" style={{ textTransform: "none" }} color="secondary">
							<DisabledByDefaultIcon />
							Reject All Transactions
						</Button>
					</div>
				</Toolbar>
			</AppBar>
			<Tooltip arrow title="Network">
				<div className="flex-col-center p10">
					<TokenIcon symbol={network.current.token} style={{ width: 70, height: 70 }} />
					<Typography style={{ marginTop: 10 }}>{network.current.name}</Typography>
				</div>
			</Tooltip>
			<div className="flex-row-center">
				<div className="p15 flex-row-center" style={{ flex: 0.95 }}>
					<Typography variant="body2">
						From :{" "}
						<Tooltip title={`Click to copy : `} arrow>
							<Button style={{ textTransform: "none" }}>Account 1</Button>
						</Tooltip>
					</Typography>
				</div>
				<div className="flex-row-center" style={{ flex: 0.05 }}>
					<div
						style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid #66666655" }}
						className="flex-row-center"
					>
						<ArrowForwardIcon />
					</div>
				</div>
				<div className="p15 flex-row-center" style={{ flex: 0.95 }}>
					<Typography variant="body2">
						To :{" "}
						<Tooltip title={`Click to copy : `} arrow>
							<Button style={{ textTransform: "none" }}>0x12fa...83Ec</Button>
						</Tooltip>
					</Typography>
				</div>
			</div>
		</div>
	)
}
/**
 * This gas fee has been suggested by https://remix.ethereum.org. Overriding this may cause a problem with your transaction. Please reach out to https://remix.ethereum.org if you have questions.
 */
