import { ethers } from "ethers"

let provider: ethers.providers.JsonRpcProvider
let accounts: string[]
beforeAll(async () => {
	provider = new ethers.providers.JsonRpcProvider("http://localhost:11235")
	accounts = await provider.listAccounts()
	console.log(`accounts : ${accounts.join(" , ")}`)
	expect(accounts.length > 0).toBeTruthy()
})

describe("Json RPC", () => {
	test("eth_call", async () => {})
})
