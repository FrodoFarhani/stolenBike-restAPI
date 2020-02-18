import App from "./app";
import logger from "./lib/logger";
import controllers from "./api/controllers/index";

process.on("uncaughtException", error => {
	logger.error(error.message);
	process.exit(1);
});
process.on("unhandledRejection", () => {
	logger.error("unhandledRejection");
	process.exit(1);
});

const app = new App(controllers.map(Controller => new Controller()));
app.listen();
