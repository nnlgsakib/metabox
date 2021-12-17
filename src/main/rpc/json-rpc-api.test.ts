import { BigNumber, ethers } from "ethers"
import ERC20Abi from "../../abis/erc20.abi.json"
import { BigNumber as BN } from "bignumber.js"

/// Sample token (SMT) on Polygon testnet
const USDT_ADDRESS = "0xc11396B95eeEf7568245c9c8d75Cf709b2ca999A"
let token: ethers.Contract
let provider: ethers.providers.JsonRpcProvider
let signer: ethers.providers.JsonRpcSigner
let accounts: string[]
const CHAIN_ID = 80001
beforeAll(async () => {
	provider = new ethers.providers.JsonRpcProvider("http://localhost:11235", {
		chainId: CHAIN_ID,
		name: "Polygon",
	})
	accounts = await provider.listAccounts()
	signer = provider.getUncheckedSigner()
	console.log(`accounts : ${accounts.join(" , ")}`)
	token = new ethers.Contract(USDT_ADDRESS, ERC20Abi, signer)
	expect(accounts.length > 0).toBeTruthy()
})

describe("Json RPC", () => {
	test("eth_call - get token balance of first account in Polygon network", async () => {
		const decimals = await token.decimals()
		console.log(`Token Decimals : ${decimals}`)
		const _b = ((await token.balanceOf(accounts[0])) as BigNumber).toString()
		const balance = new BN(_b).dividedBy(Math.pow(10, decimals)).toNumber()
		console.log(`Balance : ${balance} token`)
		expect(balance).toBeGreaterThanOrEqual(0)
	})

	test("eth_estimateGas", async () => {
		const estimatedGas = parseInt((await provider.estimateGas({ value: "0x12", to: accounts[0] })).toString())
		expect(estimatedGas).toBeGreaterThanOrEqual(0)
	})

	test.only("eth_transaction", async () => {
		const result = {
			tx1: null,
			tx2: null,
		}
		const tokenAmount = BigNumber.from(
			"0x" + new BN(2.345678).multipliedBy(BigNumber.from(10).pow(6).toHexString()).toString(16),
		)
		const tx1Promise = token.transfer(accounts[1], tokenAmount).then((res) => (result.tx1 = res))
		const value = "0x" + new BN(0.0145).multipliedBy(BigNumber.from(10).pow(18).toHexString()).toString(16)
		const tx2Promise = signer
			.sendTransaction({
				value,
				to: accounts[1],
			})
			.then((res) => (result.tx2 = res))
		await Promise.all([tx1Promise, tx2Promise])
		console.log(result)
	}, 3600000)
})
