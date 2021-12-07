import React from "react"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import PersonAdd from "@mui/icons-material/PersonAdd"
import Settings from "@mui/icons-material/Settings"
import LockIcon from "@mui/icons-material/Lock"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck"
import AddIcon from "@mui/icons-material/Add"
import CheckIcon from "@mui/icons-material/Check"
import HelpIcon from "@mui/icons-material/Help"

import {
	Button,
	FormControlLabel,
	FormGroup,
	IconButton,
	ListItem,
	ListItemText,
	Switch,
	Typography,
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { INetworkState, NetworkAction } from "renderer/store/reducers/network.reducer"
import { AuthAction } from "renderer/store/reducers/auth.reducer"
import { IWalletsState } from "renderer/store/reducers/wallets.reducer"
import { SettingsAction } from "renderer/store/reducers/settings.reducer"

export function HomeHeaderComponent() {
	const dispatch = useDispatch()
	const wallets: IWalletsState = useSelector((s: any) => s.wallets)
	const network: INetworkState = useSelector((s: any) => s.network)
	const isNightMode: boolean = useSelector((s: any) => s.settings.theme == "dark")
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const onLockWallet = React.useCallback(() => {
		setTimeout(() => dispatch({ type: AuthAction.SetPassword, password: null }), 400)
	}, [dispatch])

	const [anchorElNetworks, setAnchorElNetworks] = React.useState<null | HTMLElement>(null)
	const networksMenuOpen = Boolean(anchorElNetworks)
	const handleOpenNetworks = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			setAnchorElNetworks(event.currentTarget)
		},
		[setAnchorElNetworks],
	)
	const handleCloseNetworks = React.useCallback(() => {
		setAnchorElNetworks(null)
	}, [setAnchorElNetworks])

	const [showTestnets, setShowTestnets] = React.useState(network.current.isTestnet)
	const switchShowTestnet = React.useCallback(() => {
		setShowTestnets(!showTestnets)
	}, [showTestnets])

	const networks = React.useMemo(
		() => network.networks.filter((n) => n.isTestnet == showTestnets),
		[network.networks, showTestnets],
	)

	const onSelectNetwork = React.useCallback(
		(networkId: number) => {
			dispatch({ type: NetworkAction.SetCurrent, networkId })
			handleCloseNetworks()
		},
		[handleCloseNetworks, dispatch],
	)

	const onSwitchNightMode = React.useCallback(() => {
		dispatch({ type: SettingsAction.SwitchTheme })
	}, [dispatch])

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row-reverse",
				alignItems: "center",
				backgroundColor: "#01010110",
				position: "relative",
			}}
		>
			<div style={{ padding: 20 }}>
				<Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
					<div>
						<Tooltip arrow title="Current Network">
							<Button
								id="networks-menu"
								aria-controls="networks-menu"
								aria-haspopup="true"
								aria-expanded={networksMenuOpen ? "true" : undefined}
								onClick={handleOpenNetworks}
								variant="outlined"
								style={{ textTransform: "none" }}
							>
								<NetworkCheckIcon style={{ marginRight: 10 }} /> {network.current.name} <ArrowDropDownIcon />
							</Button>
						</Tooltip>
						<Menu
							id="networks-menu"
							anchorEl={anchorElNetworks}
							open={networksMenuOpen}
							onClose={handleCloseNetworks}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}
						>
							<ListItem>
								<FormGroup>
									<FormControlLabel
										control={<Switch color="secondary" checked={showTestnets} />}
										label="Show Test Networks(Testnets)"
										onClick={switchShowTestnet}
									/>
								</FormGroup>
							</ListItem>
							<ListItem>
								<ListItemText>
									<Typography variant="caption" color="secondary">
										Networks:
									</Typography>
								</ListItemText>
							</ListItem>
							{networks.map((n) => (
								<MenuItem onClick={() => onSelectNetwork(n.id)}>
									{n.id == network.current.id ? (
										<CheckIcon style={{ marginRight: 6, fontSize: 22 }} />
									) : n.locked ? (
										<LockIcon style={{ marginRight: 6, fontSize: 14 }} />
									) : null}
									{n.name}
								</MenuItem>
							))}
							<ListItem style={{ display: "flex", flexDirection: "row-reverse" }}>
								<Button variant="contained" color="primary" size="small">
									<AddIcon />
									Add Network
								</Button>
							</ListItem>
						</Menu>
					</div>
					<Tooltip title="My Account" arrow>
						<IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
							<Avatar sx={{ width: 38, height: 38 }}></Avatar>
						</IconButton>
					</Tooltip>
				</Box>
				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					onClick={handleClose}
					PaperProps={{
						elevation: 0,
						sx: {
							overflow: "visible",
							filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
							mt: 1.5,
							"& .MuiAvatar-root": {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							"&:before": {
								content: '""',
								display: "block",
								position: "absolute",
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: "background.paper",
								transform: "translateY(-50%) rotate(45deg)",
								zIndex: 0,
							},
						},
					}}
					transformOrigin={{ horizontal: "right", vertical: "top" }}
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				>
					<ListItem>
						<ListItemText>Wallets</ListItemText>
					</ListItem>
					{wallets.list.map((w) => (
						<MenuItem style={{ background: w.id == wallets.selectedWallet ? "#00000010" : undefined }}>
							<Avatar style={{ width: 38, height: 38 }}>
								<AccountBalanceWalletIcon />
							</Avatar>{" "}
							{w.name}
						</MenuItem>
					))}
					<Divider />
					<MenuItem>
						<ListItemIcon>
							<AccountBalanceWalletIcon fontSize="small" />
						</ListItemIcon>
						Manage Wallets
					</MenuItem>
					<MenuItem>
						<ListItemIcon>
							<Settings fontSize="small" />
						</ListItemIcon>
						Settings
					</MenuItem>
					<MenuItem>
						<ListItemIcon>
							<HelpIcon fontSize="small" />
						</ListItemIcon>
						{"Help & Support"}
					</MenuItem>
					<MenuItem onClick={onLockWallet}>
						<ListItemIcon>
							<LockIcon fontSize="small" />
						</ListItemIcon>
						Lock
					</MenuItem>
					<ListItem>
						<FormGroup>
							<FormControlLabel
								control={<Switch color="primary" checked={isNightMode} />}
								label="Night Mode"
								onClick={onSwitchNightMode}
							/>
						</FormGroup>
					</ListItem>
				</Menu>
			</div>
			<div
				style={{
					//@ts-ignore
					"-webkit-app-region": "drag",
					flex: 1,
					height: 100,
					zIndex: 0,
				}}
			/>
		</div>
	)
}
