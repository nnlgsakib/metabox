import { fetchRenderer } from "../../fetch-renderer"

export function ethAccountsPipe() {
	return fetchRenderer({ method: "eth_accounts" })
}
