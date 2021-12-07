import { ethers } from "ethers"

export class Network {
	id: number
	url: string
	name: string
	token: string
	explorer: string | null
	isTestnet: boolean
	locked: boolean
	private provider: ethers.providers.JsonRpcProvider | null | undefined

	constructor(
		id: number,
		url: string,
		name: string,
		token: string,
		explorer: string | null,
		isTestnet: boolean,
		locked: boolean = false,
	) {
		this.id = id
		this.url = url
		this.name = name
		this.token = token
		this.explorer = explorer
		this.isTestnet = isTestnet
		this.locked = locked
	}

	getProvider(): ethers.providers.JsonRpcProvider {
		if (!this.provider) this.resetProvider()
		return this.provider as ethers.providers.JsonRpcProvider
	}

	resetProvider(): void {
		this.provider = new ethers.providers.JsonRpcProvider(this.url, { chainId: this.id, name: this.name })
	}

	renounceProvider(): void {
		this.provider = null
	}

	hasProvider(): boolean {
		return this.provider ? true : false
	}
}
