import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator"
import { utils } from "ethers"

export function EthAddress(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "isEthAddress",
			target: object.constructor,
			propertyName: propertyName,
			// constraints: [property],
			options: validationOptions
				? validationOptions
				: { message: `Invalid address for property '${propertyName}'` },
			validator: {
				validate(value: any, args: ValidationArguments) {
					return utils.isAddress(value)
				},
			},
		})
	}
}
