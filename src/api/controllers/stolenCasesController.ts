import { Officers } from 'src/database/entity/officers';
import { Router, Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";

import Controller from "../interfaces/controllerInterface";
import NotImplementedException from "../exeptions/NotImplementedException";
import validationMiddleware from "../middlewares/validationMiddleware";
import StolenCases from "../../database/entity/stolenCases";
import logger from "../../lib/logger";
import StolenCaseRepository from "../../database/repository/StolenCasesRepository";
import OfficerRepository from "../../database/repository/officersRepository";
import MissingParametersException from "../exeptions/MissingParametersException";
import Status from "../../enums/statusEnum";
import Officers from "../../database/entity/officers";

export default class stolenCasesController implements Controller {
	public path = "/cases";

	public router: Router = Router();

	private entityManager: any = null;

	constructor() {
		this.initializeRoutes();
		this.entityManager = getCustomRepository(StolenCaseRepository);
	}

	private initializeRoutes(): void {
		this.router.get(`${this.path}:id`, this.findOne);
		this.router.get(`${this.path}`, this.findList);
		this.router.post(
			this.path,
			validationMiddleware(StolenCases),
			this.newCase
		);
		this.router.put(
			this.path,
			this.updateStolenCase
		);
		this.router.delete(this.path, this.deleteCase);
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

	private newCase = async (
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		const newRecord: StolenCases = request.body.stolenCase;

		try {
			const officerEntityManager = getCustomRepository(OfficerRepository);
			const freeOfficer: Officers | undefined = await officerEntityManager.findFreeOfficer();
			if (freeOfficer) {
				newRecord.officerId = freeOfficer.id;
				newRecord.Status = Status.PROCESSING;
				freeOfficer.isAvailable = false;
				await officerEntityManager.updateOfficers(freeOfficer.id, freeOfficer);
			}

			const data: any = await this.entityManager.createAndSave(newRecord);
			logger.info("New stolenCase added successfully", newRecord);
			response.send(data);
		} catch (error) {
			logger.error("Adding new stolenCase Failed:" + error);
			next(error);
		}
	};
	private updateStolenCase = async (
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		const newRecord: StolenCases = request.body.stolenCase;

		try {
			const stolenCaseObj = this.entityManager.findeOneStolenCase(newRecord.id);
			stolenCaseObj.officerId = 0;
			stolenCaseObj.Status = Status.RESOLVED;	

			const officerEntityManager = getCustomRepository(OfficerRepository);
			const assignedOfficer:Officers | undefined = await officerEntityManager.findOneOfficer(stolenCaseObj.officerId);
			if (assignedOfficer) {
				assignedOfficer.isAvailable = true;
				await officerEntityManager.updateOfficers(assignedOfficer.id, assignedOfficer);
			}
			
			const data: any = await this.entityManager.updateStolenCase(stolenCaseObj);
			logger.info("New stolenCase added successfully", stolenCaseObj);
			response.send(data);

		} catch (error) {
			logger.error("Adding new stolenCase Failed:" + error);
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
			const data: any = await this.entityManager.allStolenCases();

			logger.info("Called URL findList in StolenCases:");
			response.status(200).send(data);
		} catch (error) {
			logger.info(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	};

	private deleteCase = async (
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
			const data: any = await this.entityManager.deleteStolenCase(id);

			logger.info("Called URL deleye StolenCases:", { id });
			response.status(200).send(data);
		} catch (error) {
			logger.info(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	};
}
