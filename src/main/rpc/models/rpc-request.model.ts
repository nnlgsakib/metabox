import { ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString } from "class-validator"

export const supportedRpcMethods = [
	"eth_accounts",
	"eth_call",
	"eth_estimateGas",
	"eth_gasPrice",
	"eth_sign",
	"eth_signTransaction",
	"eth_getBalance",
	"eth_sendTransaction",
	"eth_getTransactionByHash",
]

export class RpcRequest {
	@IsInt()
	@IsOptional()
	id: number

	@IsString()
	@IsOptional()
	jsonrpc: string

	@IsString()
	@IsIn(supportedRpcMethods, { message: "Unsupported method" })
	method: string

	@IsArray()
	@ArrayMaxSize(100)
	params: any[]
}
