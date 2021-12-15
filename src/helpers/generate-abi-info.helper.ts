import Crypto from "crypto-js"

export interface IAbiMethodInfo {
	id: string
	method: string
	name: string
	inputs: Array<{ name: string; type: string }>
}
export type AbiInfo = Array<IAbiMethodInfo>

export function generateAbiInfo(abi: any[]): AbiInfo {
	const info: AbiInfo = []
	for (const f of abi) {
		const inputTypes = f.inputs.map((input) => input.type)
		const preparedMethod = `${f.name}(${inputTypes.join(",")})`
		const methodHash = Crypto.SHA3(preparedMethod, { outputLength: 256 }).toString().slice(0, 8)
		info.push({
			id: methodHash,
			method: preparedMethod,
			name: f.name,
			inputs: f.inputs,
		})
	}
	return info
}
