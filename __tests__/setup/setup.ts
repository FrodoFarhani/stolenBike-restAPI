import {
	createConnection,
	Connection,
	getConnectionOptions,
	getConnection
} from "typeorm";
beforeAll(async () => {
	let connection: Connection;
	try {
		const connectionOptions = await getConnectionOptions();
		connection = await createConnection(connectionOptions);
		if (!connection.isConnected) {
			await connection.connect();
		}
	} catch (e) {
		console.log("in setup: DB connection failed!");
	}
});

afterAll(async () => {
	await getConnection().close();
});
