import { Router } from "express";
import Controller from "../interfaces/controllerInterface";

export default class Officers implements Controller {
	public path = "/officers";

	public router: Router = Router();
}
