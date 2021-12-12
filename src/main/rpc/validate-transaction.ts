import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { TransactionModel } from "./models/transaction.model"
import { validatorOptions } from "./validator-options"

export async function validateTransaction(transaction: object): Promise<TransactionModel> {
	const tx = plainToClass(TransactionModel, transaction)
	const errors = await validate(tx, validatorOptions)
	if (errors.length > 0)
		throw new Error(`Error on transaction validation : ${errors.map((e) => e.toString()).join(" ; ")}`)
	return tx
}
