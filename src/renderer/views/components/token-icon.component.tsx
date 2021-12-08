import { Avatar } from "@mui/material"
import eth from "../../img/coins/eth.svg"
import bnb from "../../img/coins/bnb.svg"
import matic from "../../img/coins/matic.svg"
import ftm from "../../img/coins/ftm.svg"
import usdt from "../../img/coins/usdt.svg"

const icons: { [s: string]: string } = {
	eth,
	bnb,
	matic,
	ftm,
	usdt,
}

export function TokenIcon({ symbol, ...otherProps }: { symbol: string; [k: string]: any }) {
	const s = symbol.toLowerCase()
	let icon
	if (icons.hasOwnProperty(s)) icon = icons[s]
	return (
		<Avatar draggable={false} src={icon} {...otherProps}>
			{!icon ? symbol.toUpperCase() : null}
		</Avatar>
	)
}
