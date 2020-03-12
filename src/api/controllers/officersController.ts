/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
import { Router, Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";

import Controller from "../interfaces/controllerInterface";
import OfficersRepository from "../../database/repository/officersRepository";
import NotImplementedException from "../exeptions/NotImplementedException";
import logger from "../../lib/logger";
import Officers from "../../database/entity/officers";
import MissingParametersException from "../exeptions/MissingParametersException";
import RecordNotFoundException from "../exeptions/RecordNotFoundException";
// import validationMiddleware from "../middlewares/validationMiddleware";

export default class OfficersController implements Controller {
	public path = "/officers/";

	public router: Router = Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.get(`${this.path}:id`, this.findOne);
		this.router.get(`${this.path}`, this.findList);
		this.router.post(
			this.path,
			// validationMiddleware(Officers, true),
			this.newOfficer
		);
		this.router.delete(`${this.path}:id`, this.deleteOfficer);
		this.router.all(`${this.path}:id/*`, this.error);
	}

	private error = async (
		_request: Request,
		response: Response
	): Promise<void> => {
		const error = new NotImplementedException();
		logger.error("Bad Request:", error);
		response.status(error.status).send({
			message: error.message
		});
	};

	private newOfficer = async (
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		const newRecord = new Officers();
		const { staffCode } = request.body;
		newRecord.staffCode = staffCode;
		console.log("staffCode:", staffCode);

		try {
			const entityManager = getCustomRepository(OfficersRepository);
			const data: any = await entityManager.createAndSave(newRecord);

			logger.success("New officer added successfully", data);
			response.send(data);
		} catch (error) {
			logger.error(`Adding new officer error:${error}`);
			next(error);
		}
	};

	private findOne = async (
		request: Request,
		response: Response
	): Promise<void> => {
		try {
			const { id } = request.params;
			console.log("HERE:", OfficersRepository);
			const entityManager = getCustomRepository(OfficersRepository);
			const data: any = await entityManager.findOneOfficer(id);
			if (data) {
				logger.success("Called URL findOne Officer:", data);
				response.status(200).send(data);
			} else {
				logger.warn(`No Data found for ID:${id}`);
				const error = new RecordNotFoundException(id);
				response.status(400).send({ message: error.message });
			}
		} catch (error) {
			console.log("ERROR:", error);
			logger.error(error);
			response.status(400).send({
				message: error.message
			});
		}
	};

	private findList = async (
		_request: Request,
		response: Response
	): Promise<void> => {
		try {
			const entityManager = getCustomRepository(OfficersRepository);
			const data: any = await entityManager.allOfficers();

			logger.success("Called URL findList in Officers");
			response.status(200).send(data);
		} catch (error) {
			logger.error(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	};

	private deleteOfficer = async (
		request: Request,
		response: Response
	): Promise<void> => {
		const { id } = request.body.id;

		if (!id) {
			const message = "Required parameters missing";
			logger.info(message);
			response.status(404).send(new MissingParametersException(message));
		}

		try {
			const entityManager = getCustomRepository(OfficersRepository);
			const data: any = await entityManager.deleteOfficers(id);

			logger.info("Called URL delete Officer:", { id });
			response.status(200).send(data);
		} catch (error) {
			logger.info(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	};
}
