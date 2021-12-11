import { IsIn, IsInt, IsOptional, IsString } from "class-validator"

export class RpcRequestModel {
	@IsInt()
	@IsOptional()
	id: number

	@IsString()
	@IsOptional()
	jsonrpc: string

	@IsString()
	@IsIn()
	method: string

	params: any[]
}
