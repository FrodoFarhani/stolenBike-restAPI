import { Router, Request, Response, NextFunction } from "express";
import TestRepository from "../../database/repository/testRepository";
import Controller from "../interfaces/controllerInterface";

export default class TestController implements Controller {
	public path = "/test/";

	private testRepo: TestRepository = new TestRepository();

	public router: Router = Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.get(`${this.path}:id`, this.findOne);
	}

	private findOne = async (
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { id } = request.params;
			const data: any = await this.testRepo.findOneOfficer(id);
			response.send(data);
		} catch (error) {
			next(error);
		}
	};
}
