import React from "react"
import { INetworkState } from "renderer/store/reducers/network.reducer"
import { useSelector } from "react-redux"
import {
	Alert,
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
import ErrorIcon from "@mui/icons-material/Error"
import { ITxRequest, ITxRequestState } from "renderer/store/reducers/tx-request.reducer"
import { Network } from "renderer/models/network.model"
import { BigNumber, ethers } from "ethers"
import { BigNumber as BN } from "bignumber.js"
import { TransactionModel } from "main/rpc/models/transaction.model"
import { shortenAddress } from "helpers/shorten-address.helper"
import copy from "copy-to-clipboard"
import urlParse from "url-parse"

const weiFactor = BigNumber.from(10).pow(18).toString()

export function TransactionView({ txRequest }: { txRequest: ITxRequestState }) {
	const network: INetworkState = useSelector((s: any) => s.network)
	const theme = useTheme()
	const [tab, setTab] = React.useState(0)
	const [estimatingGasError, setEstimatingGasError] = React.useState<string | null>(null)
	const [currentTxIndex, setCurrentTxIndex] = React.useState(0)
	const [tx, setTx] = React.useState<ITxRequest | null>(null)
	React.useEffect(() => {
		setTx(txRequest.transactions[currentTxIndex])
	}, [currentTxIndex])
	const txNetwork: Network = network.networks.find((net) => net.id == tx?.chainId)
	const transaction: TransactionModel = tx?.tx
	const details = React.useMemo(() => {
		if (!transaction) return { value: 0, fee: 0, to: null, contractInteraction: false }
		const contractInteraction = transaction.data && transaction.data != "0x0" && tx.info
		const contractParamReceiver = contractInteraction
			? tx.contractParams.find((param) => param.name == "spender" || param.name == "to")?.value
			: null
		return {
			value:
				transaction.value && transaction.value != "0x0"
					? parseFloat(new BN(transaction.value).dividedBy(weiFactor).toFixed(8))
					: 0,
			fee:
				transaction.gas && transaction.gas != "0x0"
					? parseFloat(new BN(transaction.gas).dividedBy(weiFactor).toFixed(8))
					: transaction.gasLimit &&
					  transaction.gasPrice &&
					  transaction.gasLimit != "0x0" &&
					  transaction.gasPrice != "0x0"
					? parseFloat(
							new BN(transaction.gasLimit).multipliedBy(transaction.gasPrice).dividedBy(weiFactor).toFixed(8),
					  )
					: 0,
			contractInteraction,
			to: contractParamReceiver
				? ethers.utils.getAddress(contractParamReceiver)
				: ethers.utils.getAddress(transaction.to),
			contractURL:
				contractInteraction && txNetwork && txNetwork.explorer && txNetwork.explorer.length > 0
					? new urlParse(txNetwork.explorer).origin + `/address/${transaction.to}`
					: null,
		}
	}, [tx?.requestId])

	React.useEffect(async () => {}, [tx?.requestId])

	const estimateGas = React.useCallback(() => {}, [tx?.requestId])

	if (!tx || !txNetwork) return null
	return (
		<div>
			{txRequest.transactions.length > 1 ? (
				<AppBar variant="outlined" position="static" color="transparent">
					<Toolbar variant="dense">
						<Tooltip title="Previous" arrow>
							<IconButton
								size="small"
								disabled={currentTxIndex == 0}
								onClick={() => {
									setCurrentTxIndex(currentTxIndex - 1)
									setTab(0)
								}}
							>
								<ArrowBackIosNewIcon fontSize="small" />
							</IconButton>
						</Tooltip>
						<Typography style={{ margin: "0 10px 0 10px" }}>
							{currentTxIndex + 1} of {txRequest.transactions.length}
						</Typography>
						<Tooltip title="Next" arrow>
							<IconButton
								size="small"
								disabled={currentTxIndex >= txRequest.transactions.length - 1}
								onClick={() => {
									setCurrentTxIndex(currentTxIndex + 1)
									setTab(0)
								}}
							>
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
			) : null}
			<div className="flex-col-center p10">
				<TokenIcon symbol={txNetwork.token} style={{ width: 30, height: 30 }} />
				<Tooltip arrow title="Network" placement="top">
					<Typography style={{ marginTop: 10 }}>{txNetwork.name}</Typography>
				</Tooltip>
				{details.contractInteraction ? (
					<Typography variant="body2">
						Contract :{" "}
						<Tooltip title={`Click to copy contract address`} arrow>
							<Button
								style={{ textTransform: "none" }}
								onClick={() => copy(ethers.utils.getAddress(transaction.to))}
							>
								{shortenAddress(transaction.to)}
							</Button>
						</Tooltip>
					</Typography>
				) : null}
			</div>

			<div className="flex-row-center" style={{ height: 40 }}>
				<div className="flex-row-center" style={{ flex: 0.95 }}>
					<Typography variant="body2">
						From :{" "}
						<Tooltip title={`Click to copy : ${shortenAddress(tx.account.address)}`} arrow>
							<Button style={{ textTransform: "none" }} onClick={() => copy(tx.account.address)}>
								{tx.account.name}
							</Button>
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
						{(!transaction.to || transaction.to == "0x0") && transaction.data ? (
							" New Contract "
						) : details.to ? (
							<Tooltip title={`Click to copy`} onClick={() => copy(details.to)} arrow>
								<Button style={{ textTransform: "none" }}>{shortenAddress(details.to)}</Button>
							</Tooltip>
						) : (
							transaction.to
						)}
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
					<Tooltip title="Method" arrow>
						<Button size="small" variant="outlined" style={{ marginTop: 6 }} color="warning">
							Transfer
						</Button>
					</Tooltip>
				</div>
			</div>
			{estimatingGasError ? (
				<div className="p10">
					<Alert
						action={
							<Button size="small" style={{ width: 100 }} variant="outlined" color="error" onClick={estimateGas}>
								Try again
							</Button>
						}
						variant="outlined"
						color="error"
						icon={<ErrorIcon />}
					>
						Error on estimating gas, please try again.
						<br />
						{estimatingGasError}
					</Alert>
				</div>
			) : null}
			<div className="p10">
				<Tabs value={tab}>
					<Tab label="Details" onClick={() => setTab(0)} />
					<Tab label="Data" onClick={() => setTab(1)} />
				</Tabs>
				<Divider />
			</div>
			{tab == 0 ? (
				<React.Fragment>
					{tx.application ? (
						<div className="flex-col-center">
							<Tooltip title="Click to manage" arrow>
								<Button size="large" color="inherit" style={{ textTransform: "none" }}>
									Application : {tx.application.name}
								</Button>
							</Tooltip>
						</div>
					) : null}
					<List dense>
						<ListItem>
							<ListItemText>
								Transaction Value : {details.value} {txNetwork.token}
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								Estimated gas fee : {details.fee} {txNetwork.token}
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText
								primary="Total :"
								secondary={
									<Typography variant="h6" color="green">
										{details.fee + details.value} {txNetwork.token}
									</Typography>
								}
							></ListItemText>
						</ListItem>
						{details.contractURL ? (
							<ListItem>
								<ListItemText style={{ display: "flex", alignItems: "center" }}>
									Interacting with contract :{" "}
									<Button
										size="small"
										variant="outlined"
										style={{ marginLeft: 6, textTransform: "none" }}
										color="info"
										onClick={() => window.open(details.contractURL as string, "_blank")}
									>
										View in Explorer
									</Button>
								</ListItemText>
							</ListItem>
						) : null}
					</List>
				</React.Fragment>
			) : (
				<React.Fragment>
					<List dense>
						{tx.info ? (
							<React.Fragment>
								<ListItem>
									<ListItemText>Method ID : {tx.info.id}</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText primary="Method :" secondary={tx.info.method} />
								</ListItem>
								{tx.contractParams.length > 0 ? (
									<ListItem>
										<ListItemText
											primary="Method Params :"
											secondary={
												<List dense>
													{tx.contractParams.map((param) => (
														<ListItem>
															<Typography variant="caption" className="userSelectable">
																{param.name} ({param.type}) : {param.value}
															</Typography>
														</ListItem>
													))}
												</List>
											}
										/>
									</ListItem>
								) : null}
							</React.Fragment>
						) : null}
						<ListItem>
							<TextField label="Hex Data : " multiline fullWidth maxRows={20} value={transaction.data} />
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
