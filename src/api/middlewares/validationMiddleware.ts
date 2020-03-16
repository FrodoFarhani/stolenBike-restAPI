import { RequestHandler } from "express";
import validateHelper from "../../helpers/validationHelper";

/**
 * Validates data against Dto constraints
 * @param type
 * @param skipMissingProperties
 */
const validationMiddleware = (
	type: any,
	skipMissingProperties = false
): RequestHandler => {
	return async (req, res, next) => {
		try {
			await validateHelper(type, req.body, skipMissingProperties);
			next();
		} catch (error) {
			res.status(400).send({
				message: error.message
			});
		}
	};
};

export default validationMiddleware;
