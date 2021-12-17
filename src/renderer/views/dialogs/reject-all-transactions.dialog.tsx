import React from "react"
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
	DialogActions,
} from "@mui/material"
import { useDispatch } from "react-redux"
import CloseIcon from "@mui/icons-material/Close"
import { TxRequestAction } from "renderer/store/reducers/tx-request.reducer"

export function RejectAllTransactionsDialog({ open, onClose }: any) {
	const dispatch = useDispatch()

	const rejectAll = React.useCallback(() => {
		onClose()
		setTimeout(() => {
			dispatch({ type: TxRequestAction.RejectAll })
		}, 200)
	}, [])

	return (
		<Dialog open={open} maxWidth="xs" fullWidth onClose={onClose} style={{ zIndex: 1000001 }}>
			<DialogTitle style={{ position: "relative" }}>
				<Typography variant="h5">Reject All Transactions</Typography>
				<IconButton onClick={onClose} style={{ position: "absolute", top: 10, right: 10 }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent className="flex-col-center">
				<Typography variant="body1">Are you sure that you want to reject all requested transactions ?</Typography>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" color="primary" onClick={onClose} style={{ marginRight: 10 }}>
					No, Cancel
				</Button>
				<Button variant="contained" color="error" onClick={rejectAll}>
					Yes, Reject all !
				</Button>
			</DialogActions>
		</Dialog>
	)
}
