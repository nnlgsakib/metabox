import { plainToClass } from "class-transformer"
import { IsOptional, Matches, MaxLength, validate } from "class-validator"
import { EthAddress } from "./eth-address.decorator"
import { RpcException } from "./rpc.exception"
const hexPattern = /^0x([1-9a-f]+[0-9a-f]*|0)$/

export class TransactionModel {
	@IsOptional()
	@EthAddress()
	from?: string

	@IsOptional()
	@EthAddress()
	to?: string

	@IsOptional()
	@Matches(hexPattern)
	nonce?: string

	@IsOptional()
	@MaxLength(40)
	@Matches(hexPattern)
	gasLimit?: string

	@IsOptional()
	@MaxLength(40)
	@Matches(hexPattern)
	gas?: string

	@IsOptional()
	@MaxLength(40)
	@Matches(hexPattern)
	gasPrice?: string

	@IsOptional()
	@MaxLength(10000)
	@Matches(hexPattern)
	data?: string

	@IsOptional()
	@MaxLength(40)
	@Matches(hexPattern)
	value?: string

	@Matches(hexPattern)
	@MaxLength(10)
	chainId?: string

	@IsOptional()
	@Matches(/^0x([0-9,a-f,A-F]?){1,2}$/)
	type?: string

	@IsOptional()
	@MaxLength(40)
	@Matches(hexPattern)
	maxPriorityFeePerGas?: string

	@IsOptional()
	@MaxLength(40)
	@Matches(hexPattern)
	maxFeePerGas?: string
}

export async function validateTransactionOrFail(transaction: any) {
	transaction = plainToClass(TransactionModel, transaction)
	const errors = await validate(transaction)
	if (errors.length > 0)
		throw new RpcException(RpcException.Code.InvalidParams, errors.map((e) => e.value).join(" ; "))
	return true
}
