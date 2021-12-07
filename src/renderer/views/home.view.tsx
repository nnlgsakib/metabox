import React from "react"
import { Button, Card, Paper, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { IWallet } from "renderer/models/wallet.model"
import { WalletsAction } from "renderer/store/reducers/wallets.reducer"
import { ethers } from "ethers"

export function HomeView() {
	const dispatch = useDispatch()
	const wallets: IWallet[] = useSelector((s: any) => s.wallets.list)
	const __password = useSelector((s: any) => s.auth.password)

	return (
		<React.Fragment>
			{wallets.map((wallet) => (
				<Card key={wallet.id}>
					<Typography variant="body1">Wallet name : {wallet.name}</Typography>
					{wallet.accounts.map((account) => (
						<Paper style={{ backgroundColor: "#00000022", marginTop: 4 }} key={account.id}>
							<Typography variant="body2">Account name : {account.name}</Typography>
							<Typography variant="body2">Address : {account.address}</Typography>
							<Typography variant="body2">Index : {account.index}</Typography>
						</Paper>
					))}
					<Button
						onClick={() => dispatch({ type: WalletsAction.NewAccount, walletId: wallet.id, password: __password })}
						variant="contained"
					>
						Add Account
					</Button>
				</Card>
			))}
		</React.Fragment>
	)
}
