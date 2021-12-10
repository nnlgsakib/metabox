import React from "react"
import {
	Avatar,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	MenuItem,
	TextField,
	Tooltip,
	IconButton,
	Typography,
} from "@mui/material"
import { IWalletsState, WalletsAction } from "renderer/store/reducers/wallets.reducer"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { shortenAddress } from "helpers/shorten-address.helper"
import EthereumQRPlugin from "ethereum-qr-code"
import copy from "copy-to-clipboard"
import CloseIcon from "@mui/icons-material/Close"

const qr = new EthereumQRPlugin()

export function ReceiveDialog({ open, onClose }: any) {
	const dispatch = useDispatch()
	const wallets: IWalletsState = useSelector((s: any) => s.wallets)

	const [currentWallet, currentAccount] = React.useMemo(() => {
		const _w = wallets.list.find((w) => w.id == wallets.selectedWallet)
		const _a = _w ? _w.getAccount(wallets.selectedAccount as string) : null
		return [_w, _a]
	}, [wallets])

	const [qrCodeData, setQrCodeData] = React.useState<string | null>(null)

	React.useEffect(() => {
		if (!currentAccount) return null
		qr
			.toDataUrl({
				to: currentAccount?.address,
			})
			.then((data: any) => {
				setQrCodeData(data.dataURL)
			})
			.catch(() => {})
	}, [currentAccount?.address])

	const shortAddress = React.useMemo(() => shortenAddress(currentAccount?.address), [currentAccount?.address])
	const copyAddress = React.useCallback(() => {
		copy(currentAccount?.address)
		toast.success("Copied!")
	}, [currentAccount?.address])

	if (!currentWallet || !currentAccount) return null

	return (
		<Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
			<DialogTitle style={{ position: "relative" }}>
				<Typography>Receive</Typography>
				<IconButton onClick={onClose} style={{ position: "absolute", top: 10, right: 10 }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent className="flex-col-center">
				<Typography variant="subtitle1" color="secondary">
					{currentWallet.name}
				</Typography>
				<Typography variant="subtitle1" style={{ marginBottom: 10 }}>
					{currentAccount.name}
				</Typography>
				<div>
					<img style={{ width: 260, height: 260 }} src={qrCodeData as string} />
				</div>
				<div>
					<Typography variant="caption">
						Scan the QR code and send ERC-20 / BEP-20 tokens on Ethereum, BSC, MATIC or FTM network.
					</Typography>
				</div>
				<div className="p10">
					<Tooltip arrow title="Click to copy">
						<Button color="primary" onClick={copyAddress}>
							{shortAddress}
						</Button>
					</Tooltip>
				</div>
			</DialogContent>
		</Dialog>
	)
}
