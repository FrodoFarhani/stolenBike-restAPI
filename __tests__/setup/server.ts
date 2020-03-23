import controllers from "../../src/api/controllers/index";
import express from "express";
import bodyParser from "body-parser";

export const server = () => {
	const app = express();
	app.use(bodyParser.json());
	app.use(
		bodyParser.urlencoded({
			extended: true
		})
	);
	controllers.forEach(controller => {
		app.use("/", new controller().router);
	});
	return app;
};
export const close = async () => {
	process.exit(1);
};
