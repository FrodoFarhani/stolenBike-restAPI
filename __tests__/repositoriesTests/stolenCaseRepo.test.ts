import { getCustomRepository } from "typeorm";

import StolenCases from "../../src/database/entity/stolenCases";
import Officers from "../../src/database/entity/officers";
import StolenCaseRepository from "../../src/database/repository/stolenCasesRepository";
import OfficersRepository from "../../src/database/repository/officersRepository";
import { StolenCasesFactory } from "../factories/stolenCasesFactory";
import { OfficersFactory } from "../factories/officersFactory";
import setup from "../__dbSetup__";

xdescribe("Set stolenCases and officers", () => {
	setup();

	let repository: StolenCaseRepository;

	let stolenCases1: StolenCases;
	let stolenCases2: StolenCases;
	let stolenCases3: StolenCases;
	let officers1: Officers;

	describe("to check repository methods", () => {
		it("should return one case or undefined", async () => {
			repository = getCustomRepository(StolenCaseRepository);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});
			stolenCases1 = await StolenCasesFactory.create({
				officerId: officers1.id,
				stolenDate: new Date()
			});

			const expectedStolenCase1 = await repository.findOneStolenCase(
				stolenCases1.id
			);
			const expectedStolenCase2 = await repository.findOneStolenCase(1000);

			expect(expectedStolenCase1.id).toEqual(stolenCases1.id);
			expect(expectedStolenCase2).toEqual(undefined);
		});

		it("should create one case and  assign officer automatically", async () => {
			repository = getCustomRepository(StolenCaseRepository);
			const repositoryOfficers = getCustomRepository(OfficersRepository);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});

			stolenCases1.OwnerName = "TEST";
			const stolenCaseObject = await repository.createAndSave(stolenCases1);

			const expectedStolenCase1 = await repository.findOneStolenCase(
				stolenCases1.id
			);
			const expectedOfficer1 = await repositoryOfficers.findOneOfficer(
				officers1.id
			);

			expect(expectedStolenCase1.id).toEqual(stolenCaseObject.id);
			expect(expectedStolenCase1.officerId).toEqual(officers1.id);
			expect(expectedOfficer1.isAvailable).toEqual(false);
		});

		it("shold return all stolen cases", async () => {
			repository = getCustomRepository(StolenCaseRepository);
			stolenCases1 = await StolenCasesFactory.create({
				stolenDate: new Date()
			});
			stolenCases2 = await StolenCasesFactory.create({
				stolenDate: new Date()
			});
			stolenCases3 = await StolenCasesFactory.create({
				stolenDate: new Date()
			});

			const expectedResult = await repository.allStolenCases();

			expect(expectedResult.length).toBe(3);
		});

		it("shold finde stolenCase by officerId", async () => {
			repository = getCustomRepository(StolenCaseRepository);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});

			stolenCases1.OwnerName = "TEST";
			await repository.createAndSave(stolenCases1);

			const expectedStolenCase1 = await repository.findByOfficerId(
				officers1.id
			);

			expect(expectedStolenCase1.officerId).toEqual(officers1.id);
		});

		it("should find one stolen case without officerId", async () => {
			repository = getCustomRepository(StolenCaseRepository);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});
			stolenCases1.OwnerName = "TEST";
			await repository.createAndSave(stolenCases1);

			stolenCases1 = await StolenCasesFactory.create({
				stolenDate: new Date()
			});

			const expectedStolenCase1 = await repository.findStolenCaseWithoutOfficer();

			expect(expectedStolenCase1.id).toEqual(stolenCases1.id);
		});

		it("should update stolencase information", async () => {
			repository = getCustomRepository(StolenCaseRepository);
			stolenCases1 = await StolenCasesFactory.create({
				stolenDate: new Date()
			});

			let stolenCasesObj: StolenCases = new StolenCases();
			stolenCasesObj.OwnerName = "MOF";
			const expectedStolenCase1 = await repository.updateStolenCase(
				stolenCases1.id,
				stolenCasesObj
			);

			expect(expectedStolenCase1.OwnerName).toEqual("MOF");
		});

		it("should resolve case and make officer free automatically", async () => {
			repository = getCustomRepository(StolenCaseRepository);
			const repositoryOfficers = getCustomRepository(OfficersRepository);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});

			let stolenCasesObj = new StolenCases();
			stolenCasesObj.OwnerName = "TEST";
			stolenCasesObj.stolenDate = new Date();
			await repository.createAndSave(stolenCasesObj);

			await repository.caseResolved(stolenCasesObj);
			const expectedOfficer1 = await repositoryOfficers.findOneOfficer(
				officers1.id
			);
			const expectedStolenCase = await repository.findOneStolenCase(
				stolenCasesObj.id
			);

			expect(expectedStolenCase.officerId).toEqual(0);
			expect(expectedOfficer1.isAvailable).toEqual(true);
		});

		it("should delete case and make officer free automatically", async () => {
			repository = getCustomRepository(StolenCaseRepository);
			const repositoryOfficers = getCustomRepository(OfficersRepository);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});

			let stolenCasesObj = new StolenCases();
			stolenCasesObj.OwnerName = "TEST";
			stolenCasesObj.stolenDate = new Date();
			await repository.createAndSave(stolenCasesObj);

			await repository.deleteStolenCase(stolenCasesObj);
			const expectedOfficer1 = await repositoryOfficers.findOneOfficer(
				officers1.id
			);
			const expectedStolenCase = await repository.findOneStolenCase(
				stolenCasesObj.id
			);

			expect(expectedStolenCase).toBe(undefined);
			expect(expectedOfficer1.isAvailable).toEqual(true);
		});

		it("should query stolen cases via different parameters", async () => {
			repository = getCustomRepository(StolenCaseRepository);

			officers1 = await OfficersFactory.create({
				staffCode: 123
			});

			let stolenCasesObj = new StolenCases();
			stolenCasesObj.OwnerName = "TEST";
			stolenCasesObj.stolenDate = new Date();
			await repository.createAndSave(stolenCasesObj);

			await StolenCasesFactory.create({
				stolenDate: new Date(),
				type: "R",
				licenseNumber: 222,
				color: "red"
			});
			await StolenCasesFactory.create({
				stolenDate: new Date(),
				OwnerName: "MOF",
				color: "red"
			});

			let searchObj1 = "OwnerName=TEST";
			const expectedObject1 = await repository.queryCases(searchObj1);

			let searchObj2 = "type=R&color=red";
			const expectedObject2 = await repository.queryCases(searchObj2);

			let searchObj3 = "color=red";
			const expectedObject3 = await repository.queryCases(searchObj3);

			let searchObj4 = "type=R&licenseNumber=222";
			const expectedObject4 = await repository.queryCases(searchObj4);

			expect(expectedObject1[0].OwnerName).toBe("TEST");
			expect(expectedObject2[0].color).toBe("red");
			expect(expectedObject3.length).toBe(2);
			expect(expectedObject4[0].licenseNumber).toBe(222);
		});
	});
});
