import { Button, ButtonBase, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import React from "react"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { IWalletsState } from "renderer/store/reducers/wallets.reducer"
import { useSelector } from "react-redux"
import { Account, Wallet } from "renderer/models/wallet.model"
import { shortenAddress } from "helpers/shorten-address.helper"
import copy from "copy-to-clipboard"
import { toast } from "react-toastify"
import { INetworkState } from "renderer/store/reducers/network.reducer"

export function AccountBarComponent() {
	const wallets: IWalletsState = useSelector((s: any) => s.wallets)
	const [wallet, setWallet] = React.useState<Wallet | null>(null)
	const [account, setAccount] = React.useState<Account | null>(null)
	const network: INetworkState = useSelector((s: any) => s.network)

	React.useEffect(() => {
		let _w = null
		if (wallets.selectedWallet) _w = wallets.list.find((w) => w.id == wallets.selectedWallet)
		if (wallets.selectedAccount && _w)
			setAccount(_w.accounts.find((a) => a.id == wallets.selectedAccount) as Account)
		if (_w) setWallet(_w)
	}, [wallets.list, wallets.selectedWallet, wallets.selectedAccount])

	const shortenAccountAddress = React.useMemo(
		() => (account ? shortenAddress(account.address) : null),
		[account?.address],
	)

	const copyAddress = React.useCallback(() => {
		if (account?.address) {
			copy(account?.address)
			toast.success("The address copied to your clipboard.")
		}
	}, [account?.address])

	/// More menu
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<React.Fragment>
			<div style={{ display: "flex", height: 80, marginTop: 4 }}>
				<div style={{ flex: 1 }}></div>
				<div style={{ flex: 1 }}>
					<Tooltip arrow title="Copy Address">
						<Button
							fullWidth
							style={{ height: 80, textTransform: "none" }}
							className="flex-col-center"
							onClick={copyAddress}
						>
							<Typography variant="subtitle2" color="textPrimary">
								{wallet?.name}
							</Typography>
							<Typography
								variant="subtitle1"
								style={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis" }}
								color="secondary"
							>
								{account?.name}
							</Typography>
							<Typography variant="subtitle2" color="textSecondary">
								{shortenAccountAddress}
							</Typography>
						</Button>
					</Tooltip>
				</div>
				<div style={{ flex: 1, display: "flex", flexDirection: "row-reverse" }} className="p10">
					<div>
						<Tooltip arrow title="More">
							<IconButton onClick={handleClick}>
								<MoreVertIcon />
							</IconButton>
						</Tooltip>
						<Menu
							id="account-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}
						>
							<MenuItem onClick={handleClose}>View Account in Explorer</MenuItem>
							<MenuItem onClick={handleClose}>My account</MenuItem>
							<MenuItem onClick={handleClose}>Logout</MenuItem>
						</Menu>
					</div>
				</div>
			</div>
			<div style={{ padding: 6, flex: 1 }}>
				<Divider />
			</div>
		</React.Fragment>
	)
}
