import bodyParser from "body-parser";
import express from "express";
import logger from "./lib/logger";
import Controller from "./api/interfaces/controllerInterface";
import errorMiddleware from "./api/middlewares/errorMiddleware";
import { connect } from "./config/typeorm";

class App {
	public app: express.Application;

	constructor(controllers: Controller[]) {
		this.app = express();

		this.initializeDatabase();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
		this.initializeErrorHandling();
	}

	public listen() {
		this.app.listen(process.env.PORT, () => {
			logger.info(`App listening on the port ${process.env.PORT}`);
		});
	}

	private initializeMiddlewares() {
		this.app.use(bodyParser.json());
		this.app.use(
			bodyParser.urlencoded({
				extended: true
			})
		);
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}

	private initializeControllers(controllers: Controller[]) {
		controllers.forEach(controller => {
			this.app.use("/api", controller.router);
		});
	}

	private async initializeDatabase() {
		try {
			await connect();
		} catch (error) {
			logger.error("Database connection failed !");
		}
	}

	public close(PID: number) {
		process.kill(PID, "SIGTERM");
	}
}

export default App;
