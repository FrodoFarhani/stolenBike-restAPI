import { createConnection, getConnection, getConnectionOptions } from "typeorm";
import logger from "../lib/logger";

export const connect = async (connectionName = "default") => {
	try {
		const connectionOptions = await getConnectionOptions(connectionName);
		const connection = await createConnection(connectionOptions);
		logger.info("Database connection started");
		return connection;
	} catch (e) {
		logger.error(`${e}`);
		process.exit(1);
		return undefined;
	}
};

export const disconnect = (): Promise<void> => {
	const conn = getConnection();
	logger.error("DB Disconnected!");
	return conn.close();
};

export const checkConnection = () => {
	const conn = getConnection();
	return conn.query("SELECT 1 as result");
};
