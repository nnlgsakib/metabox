import { hexPattern } from "./models/transaction.model"

export function validateBlockTag(tag: string | number) {
	if (Number.isInteger(tag) && tag > 0) return tag
	if (tag == "earliest" || tag == "pending" || (tag as string).match(hexPattern)) return tag
	return "latest"
}
