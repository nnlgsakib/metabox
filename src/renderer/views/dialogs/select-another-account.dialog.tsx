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
	Typography,
} from "@mui/material"
import { IWalletsState, WalletsAction } from "renderer/store/reducers/wallets.reducer"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { shortenAddress } from "helpers/shorten-address.helper"
import { TokenIcon } from "../components/token-icon.component"

export function SelectAnotherAccountDialog({ open, onClose }: any) {
	const dispatch = useDispatch()
	const wallets: IWalletsState = useSelector((s: any) => s.wallets)
	const __password: string = useSelector((s: any) => s.auth.password)

	const currentWallet = React.useMemo(
		() => wallets.list.find((w) => w.id == wallets.selectedWallet),
		[wallets],
	)

	const selectAccount = React.useCallback(
		(id: string) => {
			dispatch({ type: WalletsAction.SelectAccount, accountId: id })
			toast.success("The account switched")
			onClose()
		},
		[currentWallet?.id],
	)

	if (!currentWallet) return null

	return (
		<Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
			<DialogTitle>
				<Typography>Select Account</Typography>
			</DialogTitle>
			<DialogContent>
				<List sx={{ width: "100%" }}>
					{currentWallet.accounts.map((account) => {
						const isSelected = account.id == wallets.selectedAccount
						return (
							<MenuItem
								key={account.id}
								disabled={isSelected}
								onClick={!isSelected ? () => selectAccount(account.id) : undefined}
								style={{ marginTop: 15 }}
							>
								<ListItemAvatar>
									<TokenIcon style={{ width: 50, height: 50 }} address={account.address} />
								</ListItemAvatar>
								<ListItemText
									primary={
										<div>
											{account.name}
											{isSelected ? <Chip label="Selected" size="small" style={{ marginLeft: 6 }} /> : null}
										</div>
									}
									secondary={shortenAddress(account.address)}
								/>
							</MenuItem>
						)
					})}
				</List>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" color="secondary" onClick={onClose} style={{ marginRight: 4 }}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
}
