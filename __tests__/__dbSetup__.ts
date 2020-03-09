import "jest-extended";

import { connect, disconnect } from "../src/config/typeorm";
import { clean } from "./support/cleanDb";

export default () => {
	beforeAll(async () => {
		await connect();
		await clean();
	});

	afterAll(disconnect);
	beforeEach(clean);
	afterEach(clean);
};
