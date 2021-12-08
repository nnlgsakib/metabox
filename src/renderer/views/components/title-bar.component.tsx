import React from "react"
import { ButtonBase, Divider, Tooltip } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { getCurrentWindow } from "@electron/remote"
const minimizeApp = () => {
	getCurrentWindow().minimize()
}

const closeApp = () => {
	getCurrentWindow().close()
}

export function TitleBar() {
	return (
		<React.Fragment>
			<div
				style={{
					width: "100%",
					height: 40,
					display: "flex",
					flexDirection: "row-reverse",
				}}
			>
				<Tooltip arrow title="Close">
					<ButtonBase style={{ width: 50, height: 35, color: "red" }} onClick={closeApp}>
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
					}}
				></div>
			</div>
		</React.Fragment>
	)
}
