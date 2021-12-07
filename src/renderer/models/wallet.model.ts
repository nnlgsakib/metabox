import { utils, ethers } from "ethers"
import Crypto from "crypto-js"
import { v4 as uuid } from "uuid"

export class WalletException extends Error {}

export interface IAccount {
	id: string
	index: number
	name: string
	address: string
	privateKey: string
	getSigner(password: string, provider?: ethers.providers.BaseProvider): ethers.Signer
}

export interface IWallet {
	id: string
	name: string
	mnemonic: string | null
	accounts: IAccount[]
	newAccount(name: string, password: string): Account
	getAccount(id: string): Account
}

export class Account implements IAccount {
	id: string
	index: number
	name: string
	address: string
	privateKey: string
	constructor(id: string, index: number, name: string, address: string, privateKey: string) {
		this.id = id
		this.index = index
		this.name = name
		this.address = address
		this.privateKey = privateKey
	}

	getSigner(password: string, provider?: ethers.providers.BaseProvider): ethers.Signer {
		const privateKey = Wallet.decrypt(this.privateKey, password)
		return new ethers.Wallet(privateKey, provider)
	}
}

const errorMsgs = {
	invalidMnemonic:
		"This wallet is imported directly from a private key, and it could not create another account, please create new wallet based on mnemonic phrase and try again.",
	decyptingWallet: "Error on decrypting wallet",
}

export class Wallet implements IWallet {
	id: string
	name: string
	mnemonic: string | null
	accounts: Account[]
	constructor(id: string, name: string, mnemonic: string) {
		this.id = id
		this.name = name
		this.mnemonic = mnemonic
		this.accounts = []
	}

	static encrypt(message: string, secret: string): string {
		return Crypto.AES.encrypt(message, secret).toString(Crypto.format.OpenSSL)
	}

	static decrypt(message: string, secret: string): string {
		return Crypto.AES.decrypt(Crypto.format.OpenSSL.parse(message), secret).toString(Crypto.enc.Utf8)
	}

	getLastIndex(): number {
		let last = -1
		this.accounts.forEach((account) => {
			if (account.index > last) last = account.index
		})
		return last
	}

	newAccount(name: string, password: string): Account {
		if (!this.mnemonic) throw new WalletException(errorMsgs.invalidMnemonic)
		const mnemonic = Wallet.decrypt(this.mnemonic as string, password)
		if (mnemonic.split(" ").length != 12) throw new WalletException(errorMsgs.decyptingWallet)
		const index = this.getLastIndex() + 1
		const path = `m/44'/60'/0'/0/${index}`

		const hdWallet = utils.HDNode.fromMnemonic(mnemonic).derivePath(path)
		const encryptedPrivateKey = Wallet.encrypt(hdWallet.privateKey, password)
		const account = new Account(uuid(), index, name, hdWallet.address, encryptedPrivateKey)
		console.log(hdWallet)
		this.accounts.push(account)
		return account
	}

	getAccount(id: string): Account {
		const foundAccount = this.accounts.find((account) => account.id == id)
		if (!foundAccount) throw new WalletException("The account does not exist anymore")
		return foundAccount
	}
}
