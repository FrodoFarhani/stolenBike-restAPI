import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import * as express from "express";
import HttpException from "../exeptions/HttpException";

function validationMiddleware(type: any): express.RequestHandler {
	return (req, _res, next) => {
		validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
			if (errors.length > 0) {
				const message = errors
					.map((error: ValidationError) => Object.values(error.constraints))
					.join(", ");
				next(new HttpException(400, message));
			} else {
				next();
			}
		});
	};
}

export default validationMiddleware;