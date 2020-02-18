import { connect, disconnect } from "./config/typeorm";
import logger from "./lib/logger";

connect()
	.then(() => {
		logger.info("DB CONNECTED");
	})
	.then(disconnect);
