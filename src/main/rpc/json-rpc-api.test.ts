import { BigNumber, ethers } from "ethers"
import ERC20Abi from "../../abis/erc20.abi.json"
import { BigNumber as BN } from "bignumber.js"

/// USDT token on Polygon mainet
const USDT_ADDRESS = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
let usdtToken: ethers.Contract
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]
beforeAll(async () => {
	provider = new ethers.providers.JsonRpcProvider("http://localhost:11235", { chainId: 137, name: "Polygon" })
	accounts = await provider.listAccounts()
	console.log(`accounts : ${accounts.join(" , ")}`)
	usdtToken = new ethers.Contract(USDT_ADDRESS, ERC20Abi, provider.getUncheckedSigner())
	expect(accounts.length > 0).toBeTruthy()
})

describe("Json RPC", () => {
	test("eth_call - get USDT balance of first account in Polygon network", async () => {
		const decimals = parseInt((await usdtToken.decimals()) as string)
		console.log(`Token Decimals : ${decimals}`)
		const _b = ((await usdtToken.balanceOf(accounts[0])) as BigNumber).toString()
		const balance = new BN(_b).dividedBy(Math.pow(10, decimals)).toNumber()
		console.log(`Balance : ${balance} USDT`)
		expect(balance).toBeGreaterThanOrEqual(0)
	})

	test("eth_estimateGas", async () => {
		const estimatedGas = parseInt((await provider.estimateGas({ value: "0x12", to: accounts[0] })).toString())
		expect(estimatedGas).toBeGreaterThanOrEqual(0)
	})

	test("eth_transaction", async () => {
		const tx = await usdtToken.transfer(accounts[1], BigNumber.from(0))
		console.log(tx)
	})
})
