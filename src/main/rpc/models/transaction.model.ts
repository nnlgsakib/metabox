import { IsOptional, Matches, MaxLength } from "class-validator"
import { EthAddress } from "./eth-address.decorator"
export const hexPattern = /^0x([0-9a-f]*|0)$/

export class TransactionModel {
	@EthAddress()
	from: string

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
	@Matches(hexPattern)
	data?: string

	@IsOptional()
	@MaxLength(40)
	@Matches(hexPattern)
	value?: string

	@Matches(hexPattern)
	@MaxLength(10)
	@IsOptional()
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
