import React from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { IWalletsState, WalletsAction } from "renderer/store/reducers/wallets.reducer"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"

export function NewAccountDialog({ open, onClose }: any) {
	const dispatch = useDispatch()
	const wallets: IWalletsState = useSelector((s: any) => s.wallets)
	const __password: string = useSelector((s: any) => s.auth.password)

	const currentWallet = React.useMemo(
		() => wallets.list.find((w) => w.id == wallets.selectedWallet),
		[wallets],
	)

	const createAccount = React.useCallback(() => {
		dispatch({ type: WalletsAction.NewAccount, walletId: currentWallet?.id, password: __password })
		toast.success("The account created")
		onClose()
	}, [currentWallet?.id])

	if (!currentWallet) return null

	return (
		<Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
			<DialogTitle>
				<Typography>New Account</Typography>
			</DialogTitle>
			<DialogContent>
				<div className="p10">
					<Typography variant="body1">Do you want to create new account in the wallet below?</Typography>
					<Typography variant="subtitle1" color="secondary">
						Wallet : {currentWallet?.name}
					</Typography>
				</div>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" color="secondary" onClick={onClose} style={{ marginRight: 4 }}>
					Cancel
				</Button>
				<Button variant="contained" color="primary" onClick={createAccount}>
					Yes, Create Now!
				</Button>
			</DialogActions>
		</Dialog>
	)
}
