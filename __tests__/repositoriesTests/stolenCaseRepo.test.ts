import { getCustomRepository } from "typeorm";

import StolenCases from "../../src/database/entity/stolenCases";
import Officers from "../../src/database/entity/officers";
import stolenCasesRepository from "../../src/database/repository/stolenCasesRepository";
import { StolenCasesFactory } from "../factories/stolenCasesFactory";
import { OfficersFactory } from "../factories/officersFactory";
import setup from "../__dbSetup__";

setup();

describe("Set stolenCases and officers", () => {
	let repository: stolenCasesRepository;

	let stolenCases1: StolenCases;
	let stolenCases2: StolenCases;
	let stolenCases3: StolenCases;
	let stolenCases4: StolenCases;
	let officers1: Officers;
	let officers2: Officers;
	let officers3: Officers;

	describe("to check repository methods", () => {
		beforeEach(async () => {
			// repository = getCustomRepository(stolenCasesRepository)
			// officers1 = await OfficersFactory.create({
			//   staffCode:123
			// })
			// officers2 = await OfficersFactory.create({
			//   staffCode: 456
			// })
			// officers3 = await OfficersFactory.create(
			//   {
			//     staffCode: 789
			//   }
			// )
			// stolenCases1 = await StolenCasesFactory.create({
			//   officerId: officers1.id,
			//   stolenDate: new Date()
			// })
			// stolenCases2 = await StolenCasesFactory.create({
			//   officerId: officers2.id,
			//   stolenDate: new Date()
			// })
			// stolenCases3 = await StolenCasesFactory.create({
			//   officerId: officers3.id,
			//   stolenDate: new Date()
			// })
			// stolenCases4 = await StolenCasesFactory.create({
			//   stolenDate: new Date()
			// })
		});

		it("findOneStolenCase should return one case or undefined", async () => {
			repository = getCustomRepository(stolenCasesRepository);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});
			console.log("officers1:", officers1);

			stolenCases1 = await StolenCasesFactory.create({
				officerId: officers1.id,
				stolenDate: new Date()
			});

			const expectedStolenCase1 = await repository.findOneStolenCase(
				stolenCases1.id
			);
			const expectedStolenCase2 = await repository.findOneStolenCase(1000);
			expect(expectedStolenCase1).toEqual(1);
			expect(expectedStolenCase2).toEqual(undefined);
		});
	});
});
