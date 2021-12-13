import { fetchRenderer } from "../../fetch-renderer"
import { validateBlockTag } from "../validate-blocktag"
import { validateTransaction } from "../validate-transaction"

export async function ethCallPipe(params: any[]) {
	const transaction = await validateTransaction(params[0])
	const blocktag = validateBlockTag(params[1])
	return await fetchRenderer({ method: "eth_call", payload: { transaction, blocktag } }, 15)
}
