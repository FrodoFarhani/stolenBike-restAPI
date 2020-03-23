import request from "supertest";

import setup from "../__dbSetup__";
import { server } from "../setup/server";
import Officers from "../../src/database/entity/officers";
import { OfficersFactory } from "../factories/officersFactory";

describe("Officers api tests", () => {
	setup();
	const app = server();

	let officers1: Officers;
	let officers2: Officers;

	describe("Test the root path", () => {
		it("should response the GET method", async () => {
			officers1 = await OfficersFactory.create({
				staffCode: 622
			});

			const response = await request(app).get("/officers/622");

			expect(response.status).toBe(200);
			expect(response.body.staffCode).toBe(622);
		});
	});
});
