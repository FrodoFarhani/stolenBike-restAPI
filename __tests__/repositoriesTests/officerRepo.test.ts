import { getCustomRepository } from "typeorm";

import StolenCases from "../../src/database/entity/stolenCases";
import Officers from "../../src/database/entity/officers";
import { StolenCasesFactory } from "../factories/stolenCasesFactory";
import { OfficersFactory } from "../factories/officersFactory";
import StolenCaseRepository from "../../src/database/repository/stolenCasesRepository";
import OfficersRepository from "../../src/database/repository/officersRepository";
import setup from "../__dbSetup__";

describe("Set stolenCases and officers", () => {
	setup();
	let stolenCases1: StolenCases;
	let stolenCases2: StolenCases;
	let stolenCases3: StolenCases;
	let officers1: Officers;
	let officers2: Officers;
	let officers3: Officers;

	describe("Check repository methods", () => {
		it("should return one case or undefined", async () => {
			const officersReo: OfficersRepository = getCustomRepository(
				OfficersRepository
			);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});
			officers2 = await OfficersFactory.create({
				staffCode: 456,
				isAvailable: false
			});

			const expectedStolenCase1 = await officersReo.findOneOfficer(
				officers1.id
			);
			const expectedStolenCase2 = await officersReo.findOneOfficer(1000);

			expect(expectedStolenCase1.id).toEqual(officers1.id);
			expect(expectedStolenCase2).toEqual(undefined);
		});

		it("should create one officer and  assign to stolenCase automatically", async () => {
			const stolenCasesRepo: StolenCaseRepository = getCustomRepository(
				StolenCaseRepository
			);
			const officersReo: OfficersRepository = getCustomRepository(
				OfficersRepository
			);

			stolenCases1 = await StolenCasesFactory.create({
				stolenDate: new Date()
			});

			officers1.staffCode = 123;
			const officerObject = await officersReo.createAndSave(officers1);

			const expectedStolenCase1 = await stolenCasesRepo.findOneStolenCase(
				stolenCases1.id
			);
			const expectedOfficer1 = await officersReo.findOneOfficer(
				officerObject.id
			);

			expect(expectedOfficer1.id).toEqual(officerObject.id);
			expect(expectedStolenCase1.officerId).toEqual(officers1.id);
			expect(expectedOfficer1.isAvailable).toEqual(false);
		});

		it("shold return all officers", async () => {
			const officersReo: OfficersRepository = getCustomRepository(
				OfficersRepository
			);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});
			officers2 = await OfficersFactory.create({
				staffCode: 456
			});
			officers3 = await OfficersFactory.create({
				staffCode: 789
			});

			const expectedResult = await officersReo.allOfficers();

			expect(expectedResult.length).toBe(3);
		});

		it("should find one free officer", async () => {
			const officersReo: OfficersRepository = getCustomRepository(
				OfficersRepository
			);
			const stolenCasesRepo: StolenCaseRepository = getCustomRepository(
				StolenCaseRepository
			);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});
			officers2 = await OfficersFactory.create({
				staffCode: 456
			});

			stolenCases1.OwnerName = "TEST";
			await stolenCasesRepo.createAndSave(stolenCases1);

			const expectedStolenCase1 = await officersReo.findFreeOfficer();

			expect(expectedStolenCase1.isAvailable).toBe(true);
		});

		it("should delete officer and change stolenCase status  automatically", async () => {
			const officersReo: OfficersRepository = getCustomRepository(
				OfficersRepository
			);
			const stolenCasesRepo: StolenCaseRepository = getCustomRepository(
				StolenCaseRepository
			);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});

			let stolenCasesObj = new StolenCases();
			stolenCasesObj.OwnerName = "TEST";
			stolenCasesObj.stolenDate = new Date();
			await stolenCasesRepo.createAndSave(stolenCasesObj);

			await officersReo.deleteOfficers(officers1.id);
			const expectedOfficer1 = await officersReo.findOneOfficer(officers1.id);
			const expectedStolenCase = await stolenCasesRepo.findOneStolenCase(
				stolenCasesObj.id
			);

			expect(expectedStolenCase.officerId).toBe(0);
			expect(expectedOfficer1.deletedAt).toBeDate();
		});
	});
});
