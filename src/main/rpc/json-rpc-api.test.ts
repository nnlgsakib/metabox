import { ethers } from "ethers"

let provider: ethers.providers.JsonRpcProvider
let accounts: string[]
beforeAll(async () => {
	provider = new ethers.providers.JsonRpcProvider("http://localhost:11235")
	accounts = await provider.listAccounts()
	expect(accounts).toHaveLength(1)
	console.log(`accounts : ${accounts.join(" , ")}`)
})

describe("Json RPC", () => {
	test.only("eth_call", async () => {})
})
