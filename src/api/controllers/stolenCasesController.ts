/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Router, Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";

import Controller from "../interfaces/controllerInterface";
import NotImplementedException from "../exeptions/NotImplementedException";
import validationMiddleware from "../middlewares/validationMiddleware";
import StolenCases from "../../database/entity/stolenCases";
import logger from "../../lib/logger";
import StolenCaseRepository from "../../database/repository/stolenCasesRepository";
import MissingParametersException from "../exeptions/MissingParametersException";
import RecordNotFoundException from "../exeptions/RecordNotFoundException";

export default class StolenCasesController implements Controller {
	public path = "/cases/";

	public router: Router = Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.get(`${this.path}`, this.findList);
		this.router.get(`${this.path}/:query`, this.findOne);
		this.router.post(
			this.path,
			validationMiddleware(StolenCases),
			this.newCase
		);
		this.router.put(`${this.path}/resolved/:id`, this.resolveStolenCase);
		this.router.put(`${this.path}:id`, this.updateStolenCase);
		this.router.delete(this.path, this.deleteCase);

		this.router.all(`${this.path}:id/*`, this.error);
		this.router.all(`${this.path}/resolved/*`, this.error);
		this.router.all(`${this.path}/all/*`, this.error);
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

	private newCase = async (
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const newRecord: StolenCases = new StolenCases();
			newRecord.OwnerName = request.body.OwnerName;
			newRecord.stolenDate = request.body.OwnerName;
			newRecord.licenseNumber = request.body.OwnerName;
			newRecord.color = request.body.OwnerName;
			newRecord.type = request.body.OwnerName;
			newRecord.description = request.body.description;

			const entityManager = getCustomRepository(StolenCaseRepository);
			const data: any = await entityManager.createAndSave(newRecord);
			logger.info("New stolenCase added successfully", newRecord);
			response.send(data);
		} catch (error) {
			logger.error(`Adding new stolenCase Failed:${error}`);
			next(error);
		}
	};

	private resolveStolenCase = async (
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { id } = request.params;
			const entityManager = getCustomRepository(StolenCaseRepository);
			const data = await entityManager.caseResolved(id);
			if (!data) {
				const message = "Record not found";
				logger.info(message);
				response.status(404).send(new RecordNotFoundException(message));
			} else {
				logger.info("StolenCase resolved successfully", data);
				response.send(data);
			}
		} catch (error) {
			logger.error(`Resolving  stolenCase Failed:${error}`);
			next(error);
		}
	};

	private updateStolenCase = async (
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		const newRecord: StolenCases = request.body;

		try {
			const entityManager = getCustomRepository(StolenCaseRepository);

			const data = await entityManager.updateStolenCase(
				newRecord.id,
				newRecord
			);
			if (!data) {
				const message = "Record not found";
				logger.info(message);
				response.status(404).send(new RecordNotFoundException(message));
			} else {
				logger.info("StolenCase has updated successfully", data);
				response.send(data);
			}
		} catch (error) {
			logger.error(`updating new stolenCase Failed:${error}`);
			next(error);
		}
	};

	private findOne = async (
		request: Request,
		response: Response
	): Promise<void> => {
		try {
			const serchObj: string = await this.getRequestKeys(request);
			if (!serchObj) {
				const message = "Required parameters missing";
				logger.info(message);
				response.status(404).send(new MissingParametersException(message));
			}

			const entityManager = getCustomRepository(StolenCaseRepository);
			const data: any = await entityManager.queryCases(serchObj);

			logger.info("Called URL findOne StolenCases:", { data });
			response.status(200).send(data);
		} catch (error) {
			logger.error(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	};

	private findList = async (
		_request: Request,
		response: Response
	): Promise<void> => {
		try {
			const entityManager = getCustomRepository(StolenCaseRepository);
			const data: any = await entityManager.allStolenCases();

			logger.info("Called URL findList in StolenCases:");
			response.status(200).send(data);
		} catch (error) {
			logger.error(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	};

	private deleteCase = async (
		request: Request,
		response: Response
	): Promise<void> => {
		try {
			const { id } = request.params;

			if (!id) {
				const message = "Required parameters missing";
				logger.info(message);
				response.status(404).send(new MissingParametersException(message));
			}

			const entityManager = getCustomRepository(StolenCaseRepository);
			const data: any = await entityManager.deleteStolenCase(id);

			logger.info("Called URL deleye StolenCases:", { id });
			response.status(200).send(data);
		} catch (error) {
			logger.error(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	};

	private async getRequestKeys(request: Request): Promise<string> {
		let queryString = ``;
		for (const key in request.query) {
			queryString += `${key}:${request.query[key]},`;
		}
		return queryString.slice(0, -1);
	}
}
