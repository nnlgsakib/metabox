import express from "express"
import http from "http"
import bodyParse from "body-parser"
import { ethers } from "ethers"
import { plainToClass } from "class-transformer"
import { RpcRequest } from "./models/rpc-request.model"
import { validate } from "class-validator"
import { RpcException } from "./models/rpc.exception"
import { validatorOptions } from "./validator-options"
import throttle from "express-throttle"
import { ethAccountsPipe } from "./pipes/eth_accounts.pipe"
import { ethCallPipe } from "./pipes/eth_call.pipe"
import { ethChainIdPipe } from "./pipes/eth_chainId.pipe"
import { ethSendTransactionPipe } from "./pipes/eth_sendTransaction.pipe"
import { ethEstimateGas } from "./pipes/eth_estimateGas.pipe"

const isDev = process.env.NODE_ENV == "development"
const app = express()
app.use(throttle({ rate: "10/s" }))
app.use(bodyParse.urlencoded({ extended: false }))
app.use(bodyParse.json())
if (isDev)
	app.use((req, res, next) => {
		console.log(`RPC : `, req.body)
		next()
	})

if (process.env.RPC_MODE) console.log(`RPC mode : ${process.env.RPC_MODE}`)
const IS_TEST_MODE = process.env.RPC_MODE == "test"
const pipelines = (() => {
	if (IS_TEST_MODE) {
		const wallet: ethers.Wallet = ethers.Wallet.createRandom()
		console.log(`New random wallet created for testing, Address : ${wallet.address} `)
		/// In test pipelines
		return {
			eth_accounts: [() => [wallet.address]],
			eth_call: [],
		}
	}
	/// In electron pipelines
	return {
		eth_chainId: [ethChainIdPipe],
		net_version: [ethChainIdPipe],
		eth_accounts: [ethAccountsPipe],
		eth_call: [ethCallPipe],
		eth_estimateGas: [ethEstimateGas],
		eth_sendTransaction: [ethSendTransactionPipe],
	}
})()

app.use(async (req, res) => {
	try {
		const _r = plainToClass(RpcRequest, req.body)
		const validationErrors = await validate(_r, validatorOptions)
		if (validationErrors.length > 0)
			throw new RpcException(RpcException.Code.InvalidRequest, validationErrors.map((e) => e.value).join(" ; "))
		const pipline = pipelines[_r.method]
		let lastResult = null
		for (const task of pipline) {
			if (!task) throw new RpcException(RpcException.Code.InternalError)
			lastResult = task(_r.params, lastResult)
			if (lastResult instanceof Promise) lastResult = await lastResult
		}
		res.send({
			jsonrpc: "2.0",
			result: lastResult,
			id: req.body.id ? req.body.id : undefined,
		})
		return 1
	} catch (e) {
		try {
			res.send({
				jsonrpc: "2.0",
				error: {
					code: Number.isInteger(e.code) ? e.code : RpcException.Code.InternalError,
					message: e.message,
				},
				id: req.body.id ? req.body.id : undefined,
			})
		} catch (e) {}
		return 0
	}
})

export class RPC_Server {
	server: http.Server
	constructor() {
		if (IS_TEST_MODE) {
			this.run()
		}
	}
	run(port: number = 11235, host: string = "localhost") {
		if (this.server) {
			this.server.close()
			this.server.removeAllListeners()
			this.server.unref()
		}
		this.server = http.createServer(app)
		try {
			this.server.listen(port, host, 0, () => {
				console.log(`Json RPC server is running on : http://${host}:${port}`)
			})
		} catch (e) {
			this.server.listen()
		}
	}
}

export const rpc = new RPC_Server()
