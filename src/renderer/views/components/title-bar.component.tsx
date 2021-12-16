import React from "react"
import { ButtonBase, Tooltip, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { getCurrentWindow } from "@electron/remote"
import { useDispatch, useSelector } from "react-redux"
import { darkTheme, lightTheme } from "renderer/theme"
import { Notification } from "@electron/remote"
import packageJson from "../../../../package.json"
import { TxRequestAction } from "renderer/store/reducers/tx-request.reducer"

const minimizeApp = () => {
	getCurrentWindow().minimize()
}

const closeApp = () => {
	getCurrentWindow().hide()
	new Notification({
		title: "MetaBox",
		body: "MetaBox Wallet is running in the background!",
		silent: true,
		subtitle: "MetaBox",
	}).show()
}

export function TitleBar() {
	const dispatch = useDispatch()
	const theme = useSelector((s: any) => s.settings.theme)
	const background =
		theme == "dark" ? darkTheme.palette.background.default : lightTheme.palette.background.default

	const onClickClose = React.useCallback(() => {
		dispatch({ type: TxRequestAction.RejectAll })
		closeApp()
	}, [])
	return (
		<React.Fragment>
			<div
				style={{
					width: "100%",
					position: "fixed",
					left: 0,
					top: 0,
					zIndex: 99999999,
					boxShadow: "3px 3px 20px #00000022",
				}}
			>
				<div style={{ height: 40, display: "flex", flexDirection: "row-reverse", backgroundColor: background }}>
					<Tooltip arrow title="Close">
						<ButtonBase style={{ width: 50, height: 35, color: "red" }} onClick={onClickClose}>
							<CloseIcon sx={{ fontSize: 16 }} />
						</ButtonBase>
					</Tooltip>
					<Tooltip arrow title="Minimize">
						<ButtonBase style={{ width: 50, height: 35 }} onClick={minimizeApp}>
							<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
						</ButtonBase>
					</Tooltip>
					<div
						style={{
							//@ts-ignore
							"-webkit-app-region": "drag",
							flex: 1,
							height: 40,
							display: "flex",
							alignItems: "center",
							paddingLeft: 18,
						}}
					>
						<Typography variant="body2">MetaBox Wallet v{packageJson.version}</Typography>
					</div>
				</div>
			</div>
			<div style={{ width: "100%", height: 40 }} />
		</React.Fragment>
	)
}
