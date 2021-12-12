import { fetchRenderer } from "../../fetch-renderer"

export function ethChainIdPipe() {
	return fetchRenderer({ method: "eth_chainId" })
}
