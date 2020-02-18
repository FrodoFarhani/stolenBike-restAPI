import { Router } from "express";
import Controller from "../interfaces/controllerInterface";

export default class implements Controller {
	public path = "/cases";

	public router: Router = Router();
}
