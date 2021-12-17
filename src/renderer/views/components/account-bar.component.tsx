import { Button, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import React from "react"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import LanguageIcon from "@mui/icons-material/Language"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import GroupIcon from "@mui/icons-material/Group"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import { IWalletsState } from "renderer/store/reducers/wallets.reducer"
import { useSelector } from "react-redux"
import { Account, Wallet } from "renderer/models/wallet.model"
import { shortenAddress } from "helpers/shorten-address.helper"
import copy from "copy-to-clipboard"
import { toast } from "react-toastify"
import { NewAccountDialog } from "../dialogs/new-account.dialog"
import { SelectAnotherAccountDialog } from "../dialogs/select-another-account.dialog"
import { INetworkState } from "renderer/store/reducers/network.reducer"
import { getAddressUrl } from "helpers/get-address-url.helper"
import { TokenIcon } from "./token-icon.component"

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

	const [newAccountDialog, setNewAccountDialog] = React.useState(false)
	const [selectAnotherAccountDialog, setSelectAnotherAcccountDialog] = React.useState(false)

	const accountUrl: string = React.useMemo(() => {
		if (!account || !network.current?.explorer || network.current?.explorer?.length == 0) return null
		return getAddressUrl(network.current.explorer, account.address)
	}, [network.current?.id, account?.address])

	return (
		<React.Fragment>
			<NewAccountDialog open={newAccountDialog} onClose={() => setNewAccountDialog(false)} />
			<SelectAnotherAccountDialog
				open={selectAnotherAccountDialog}
				onClose={() => setSelectAnotherAcccountDialog(false)}
			/>
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
				<div style={{ flex: 1, display: "flex", flexDirection: "row-reverse" }}>
					<div className="p10">
						<Tooltip arrow title="Account">
							<IconButton onClick={handleClick}>
								<TokenIcon style={{ width: 45, height: 45 }} address={account?.address} />
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
							<MenuItem
								onClick={() => {
									setNewAccountDialog(true)
									handleClose()
								}}
							>
								<PersonAddIcon style={{ marginRight: 6 }} /> New Account{" "}
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<AdminPanelSettingsIcon style={{ marginRight: 6 }} /> Manage Accounts
							</MenuItem>
							<MenuItem
								onClick={() => {
									setSelectAnotherAcccountDialog(true)
									handleClose()
								}}
							>
								<GroupIcon style={{ marginRight: 6 }} /> Select Another Account
							</MenuItem>
							<MenuItem
								disabled={!accountUrl}
								onClick={() => {
									handleClose()
									window.open(accountUrl as string, "_blank")
								}}
							>
								<LanguageIcon style={{ marginRight: 6 }} /> View Account in Explorer
							</MenuItem>
						</Menu>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}
