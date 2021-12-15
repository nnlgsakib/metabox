import React from "react"
import { INetworkState } from "renderer/store/reducers/network.reducer"
import { useSelector } from "react-redux"
import {
	AppBar,
	Button,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Tab,
	Tabs,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material"
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { TokenIcon } from "./components/token-icon.component"

export function TransactionView() {
	const network: INetworkState = useSelector((s: any) => s.network)
	const theme = useTheme()
	const [tab, setTab] = React.useState(0)

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
			<div className="flex-col-center p10">
				<TokenIcon symbol={network.current.token} style={{ width: 30, height: 30 }} />
				<Tooltip arrow title="Network" placement="top">
					<Typography style={{ marginTop: 10 }}>{network.current.name}</Typography>
				</Tooltip>
			</div>

			<div className="flex-row-center" style={{ height: 40 }}>
				<div className="flex-row-center" style={{ flex: 0.95 }}>
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
				<div className="flex-row-center" style={{ flex: 0.95 }}>
					<Typography variant="body2">
						To :{" "}
						<Tooltip title={`Click to copy : `} arrow>
							<Button style={{ textTransform: "none" }}>0x12fa...83Ec</Button>
						</Tooltip>
					</Typography>
				</div>
			</div>
			<div
				className="flex-row-center"
				style={{ backgroundColor: "#00000008", padding: 20, marginTop: 10, border: "1px solid #00000055" }}
			>
				<TokenIcon symbol="bnb" style={{ width: 40, height: 40, marginRight: 10 }} />
				<div>
					<Typography variant="h5">10 MBW</Typography>
					<Button size="small" variant="outlined" style={{ marginTop: 6 }} color="warning">
						Transfer
					</Button>
				</div>
			</div>
			<div className="p10">
				<Tabs value={tab}>
					<Tab label="Details" onClick={() => setTab(0)} />
					<Tab label="Data" onClick={() => setTab(1)} />
				</Tabs>
				<Divider />
			</div>
			{tab == 0 ? (
				<React.Fragment>
					<div className="flex-col-center">
						<Tooltip title="Click to manage" arrow>
							<Button size="large" color="inherit" style={{ textTransform: "none" }}>
								Application : MetaBox
							</Button>
						</Tooltip>
					</div>
					<List dense>
						<ListItem>
							<ListItemText>Transaction Value : 0 MATIC</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>Estimated gas fee : 0.02 MATIC</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText
								primary="Total :"
								secondary={
									<Typography variant="h6" color="green">
										0.02 MATIC + 10 MBW
									</Typography>
								}
							></ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText style={{ display: "flex", alignItems: "center" }}>
								Interacting with contract :{" "}
								<Button size="small" variant="outlined" style={{ marginLeft: 6, textTransform: "none" }} color="info">
									View in Explorer
								</Button>
							</ListItemText>
						</ListItem>
					</List>
				</React.Fragment>
			) : (
				<React.Fragment>
					<List dense>
						<ListItem>
							<ListItemText>Method ID : 135f38ea</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText primary="Method :" secondary={`transfer(address,uint256)`} />
						</ListItem>
						<ListItem>
							<ListItemText
								primary="Method Params :"
								secondary={
									<List dense>
										<ListItem>
											<Typography variant="caption" className="userSelectable">
												to (address) : 0x3738EEaf58998aEbA5427c97260DAcA1d311D8E3
											</Typography>
										</ListItem>
										<ListItem>
											<Typography variant="caption" className="userSelectable">
												amount (uint256) : 0
											</Typography>
										</ListItem>
									</List>
								}
							/>
						</ListItem>
						<ListItem>
							<TextField
								label="Hex Data : "
								multiline
								fullWidth
								maxRows={20}
								value={
									"0xa9059cbb000000000000000000000000229e3a07ba52de000f0abd058498c801255edc7e000000000000000000000000000000000000000000000000000000003b9aca00"
								}
							/>
						</ListItem>
					</List>
				</React.Fragment>
			)}
			<div style={{ marginBottom: 52 }} />
			<div
				className="flex-row-center"
				style={{
					position: "fixed",
					bottom: 0,
					left: 0,
					right: 0,
					backgroundColor: theme.palette.background.paper,
					zIndex: 1000000,
				}}
			>
				<div style={{ flex: 1, padding: 6 }}>
					<Button variant="outlined" color="primary" fullWidth>
						Reject
					</Button>
				</div>
				<div style={{ flex: 1, padding: 6 }}>
					<Button variant="contained" color="primary" fullWidth>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	)
}
/**
 * This gas fee has been suggested by https://remix.ethereum.org. Overriding this may cause a problem with your transaction. Please reach out to https://remix.ethereum.org if you have questions.
 */
