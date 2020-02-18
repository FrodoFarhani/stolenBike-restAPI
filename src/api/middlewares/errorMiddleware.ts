/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import logger from "../../lib/logger";
import HttpException from "../exeptions/HttpException";

const errorMiddleware = (
	error: HttpException,
	_request: Request,
	response: Response,
	_next: NextFunction
) => {
	const status = error.status || 500;
	const message = error.message || "Something went wrong";

	logger.error(message);
	response.status(status).send(new HttpException(status, message));
};

export default errorMiddleware;
