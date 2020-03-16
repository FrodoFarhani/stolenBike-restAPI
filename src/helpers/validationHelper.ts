import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import HttpException from "../api/exeptions/HttpException";

/**
 * Validates data against Dto constraints
 * @param type
 * @param data
 * @param skipMissingProperties
 */
const validateHelper = async (
	type: any,
	data: any,
	skipMissingProperties = false
): Promise<boolean | HttpException> => {
	const errors: ValidationError[] = await validate(plainToClass(type, data), {
		skipMissingProperties,
		forbidUnknownValues: true
	});
	if (errors.length > 0) {
		const message = errors
			.map((error: ValidationError) =>
				Object.keys(error.constraints).map(key => error.constraints[key])
			)
			.join(", ");
		throw new HttpException(400, message);
	} else {
		return true;
	}
};

/**
 * Checks whether required environment variables are present for application
 */

export default validateHelper;
