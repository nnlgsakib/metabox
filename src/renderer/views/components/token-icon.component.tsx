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

export function TokenIcon({
	symbol,
	address,
	...otherProps
}: {
	symbol?: string
	address?: string
	[k: string]: any
}) {
	const s = symbol ? symbol.toLowerCase() : null
	let icon
	if (s && icons.hasOwnProperty(s)) icon = icons[s]
	if (!icon && address) {
		//@ts-ignore
		const canvas: HTMLCanvasElement = window.blockies.create({
			seed: address,
			size: 8,
			color: `#${address.slice(2, 5)}`.toLowerCase(),
			bgColor: `#${address.slice(30, 36)}`.toLowerCase(),
			spotcolor: `#${address.slice(22, 28)}`.toLowerCase(),
			scale: 8,
		})
		icon = canvas.toDataURL()
	}
	return (
		<Avatar draggable={false} src={icon} {...otherProps}>
			{!icon ? symbol.toUpperCase() : null}
		</Avatar>
	)
}
