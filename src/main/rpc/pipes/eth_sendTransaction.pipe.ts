import { fetchRenderer } from "../../fetch-renderer"
import { validateTransaction } from "../validate-transaction"

export async function ethSendTransactionPipe(params: any[]) {
	const transaction = await validateTransaction(params[0])
	return await fetchRenderer({ method: "eth_sendTransaction", payload: { transaction } }, 3600)
}
