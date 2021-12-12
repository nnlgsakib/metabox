import { ethers } from "ethers"

let provider: ethers.providers.JsonRpcProvider
beforeAll(() => {
	provider = new ethers.providers.JsonRpcProvider("http://localhost:11235")
})
