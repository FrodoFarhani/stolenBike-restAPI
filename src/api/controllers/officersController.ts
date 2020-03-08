import { Router, Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";

import Controller from "../interfaces/controllerInterface";
import validationMiddleware from "../middlewares/validationMiddleware";
import OfficersRepository from "../../database/repository/officersRepository";
import StolenCaseRepository from "../../database/repository/StolenCasesRepository";
import NotImplementedException from "../exeptions/NotImplementedException";
import logger from "../../lib/logger";
import Officers from "../../database/entity/officers";
import MissingParametersException from "../exeptions/MissingParametersException";
import StolenCases from "../../database/entity/stolenCases";
import Status from "../../enums/statusEnum";

export default class OfficersController implements Controller {
	public path = "/officers";

	public router: Router = Router();

	private entityManager: any = null;

	constructor() {
		this.initializeRoutes();
		this.entityManager = getCustomRepository(OfficersRepository);
	}

	private initializeRoutes(): void {
		this.router.get(`${this.path}:id`, this.findOne);
		this.router.get(`${this.path}`, this.findList);
		this.router.post(
			this.path,
			validationMiddleware(Officers),
			this.newOfficer
		);
		this.router.delete(this.path, this.deleteOfficer);
		this.router.all(`${this.path}/*`, this.error);
	}

	private error = async (
		_request: Request,
		response: Response
	): Promise<void> => {
		const error = new NotImplementedException();
		response.status(error.status).send({
			message: error.message
		});
	};

	private newOfficer = async (
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		const newRecord: Officers = request.body.officer;

		try {
			const data: any = await this.entityManager.createAndSave(newRecord);

			const stolenCaseEntityManager = getCustomRepository(StolenCaseRepository);
			const stolenCaseWithoutOfficer:
				| StolenCases
				| undefined = await stolenCaseEntityManager.findStolenCaseWithoutOfficer();
			if (stolenCaseWithoutOfficer) {
				stolenCaseWithoutOfficer.officerId = data.id;
				stolenCaseWithoutOfficer.Status = Status.PROCESSING;
				await stolenCaseEntityManager.updateStolenCase(
					stolenCaseWithoutOfficer.id,
					stolenCaseWithoutOfficer
				);
			}

			logger.info("New stolenCase added successfully", newRecord);
			response.send({ data });
		} catch (error) {
			logger.error(`Adding new officer error:${error}`);
			next(error);
		}
	};

	private findOne = async (
		request: Request,
		response: Response
	): Promise<void> => {
		const { id } = request.params;

		if (!id) {
			const message = "Required parameters missing";
			logger.info(message);
			response.status(404).send(new MissingParametersException(message));
		}

		try {
			const data: any = await this.entityManager.findStolenCases(id);

			logger.info("Called URL findOne StolenCases:", { id });
			response.status(200).send(data);
		} catch (error) {
			logger.info(error);
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
			const data: any = await this.entityManager.allOfficers();

			logger.info("Called URL findList in Officers");
			response.status(200).send(data);
		} catch (error) {
			logger.info(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	};

	private deleteOfficer = async (
		request: Request,
		response: Response
	): Promise<void> => {
		const { id } = request.params;

		if (!id) {
			const message = "Required parameters missing";
			logger.info(message);
			response.status(404).send(new MissingParametersException(message));
		}

		try {
			const data: any = await this.entityManager.deleteOfficers(id);

			const stolenCaseEntityManager = getCustomRepository(StolenCaseRepository);
			const stolenCaseWithoutOfficer:
				| StolenCases
				| undefined = await stolenCaseEntityManager.findStolenCaseWithoutOfficer();
			if (stolenCaseWithoutOfficer) {
				stolenCaseWithoutOfficer.officerId = 0;
				stolenCaseWithoutOfficer.Status = Status.ASSESMENT;
				await stolenCaseEntityManager.updateStolenCase(
					stolenCaseWithoutOfficer.id,
					stolenCaseWithoutOfficer
				);
			}

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
