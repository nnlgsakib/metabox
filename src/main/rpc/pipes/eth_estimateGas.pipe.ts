import { fetchRenderer } from "../../fetch-renderer"
import { validateTransaction } from "../validate-transaction"

export async function ethEstimateGas(params: any[]) {
	const transaction = await validateTransaction(params[0])
	return await fetchRenderer({ method: "eth_estimateGas", payload: { transaction } }, 15)
}
