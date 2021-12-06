import { Link as RouterLink } from "react-router-dom"
import { Link } from "@mui/material"

export function MLink({ to, children }: { to: string; children: any }) {
	return (
		<Link component={RouterLink} to={to}>
			{children}
		</Link>
	)
}
