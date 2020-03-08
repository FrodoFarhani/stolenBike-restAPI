import { EntityRepository, getManager, getCustomRepository } from "typeorm";

import StolenCases from "../entity/stolenCases";
import { BaseRepository } from "./BaseRepository";
import Officers from "../entity/officers";
import ViwOfficersVstolenCases from "../views/viw_officersVstolenCases";
import Status from "../../enums/statusEnum";
import OfficerRepository from "./officersRepository";

@EntityRepository(StolenCases)
export default class StolenCaseRepository extends BaseRepository<StolenCases> {
	async createAndSave(stolenCase: StolenCases): Promise<StolenCases> {
		
		const officerEntityManager = getCustomRepository(OfficerRepository);
		const freeOfficer: Officers = await officerEntityManager.findFreeOfficer();
		
		if (!freeOfficer) {
			await this.manager.save(stolenCase);
			return stolenCase;
		} else {

			stolenCase.officerId = freeOfficer.id;
			stolenCase.Status = Status.PROCESSING;
			freeOfficer.isAvailable = false;

			await getManager().transaction("SERIALIZABLE", async transactionalEntityManager => {
				await transactionalEntityManager.save(stolenCase);
				await transactionalEntityManager.update(Officers, freeOfficer.id, freeOfficer);
			});

			return stolenCase;
		}
		
	}

	async allStolenCases(): Promise<StolenCases[]> {
		const stolenCasesList = await this.find();
		return stolenCasesList;
	}

	async findOneStolenCase(id: number): Promise<any> {
		const stolenCaseObj = await this.findOne({
			where: { id }
		});
		return stolenCaseObj;
	}

	async findByOfficerId(officerId: number): Promise<any> {
		const stolenCaseObj = await this.findOne({
			where: { officerId }
		});
		return stolenCaseObj;
	}

	async findStolenCaseWithoutOfficer(): Promise<any> {
		const stolenCaseObj = await this.findOne({
			where: { officerId: null || undefined || 0 }
		});
		return stolenCaseObj;
	}

	async updateStolenCase(
		id: number,
		stolenCase: StolenCases
	): Promise<StolenCases> {
		await this.manager.update(StolenCases, id, stolenCase);
		return stolenCase;
	}

	async caseResolved(
		stolenCase: StolenCases
	): Promise<StolenCases> {
		
		stolenCase.officerId = 0;
		stolenCase.Status = Status.RESOLVED;

		const assignedOfficer: Officers =await  this.findOfficer(stolenCase.id);

		if (!assignedOfficer) {
			await this.manager.update(StolenCases, stolenCase.id, stolenCase);
			return stolenCase;
		} else {
			assignedOfficer.isAvailable = true;
			await getManager().transaction("SERIALIZABLE", async transactionalEntityManager => {
				await transactionalEntityManager.update(StolenCases, stolenCase.id, stolenCase);
				await transactionalEntityManager.update(Officers, assignedOfficer.id, assignedOfficer);
			});

			return stolenCase;
		}
		
	}

	async deleteStolenCase(stolenCase: number| StolenCases) {

		const assignedOfficer: Officers = await this.findOfficer(typeof stolenCase === "number" ? stolenCase : stolenCase.id);

		if (!assignedOfficer) {
			await this.manager.delete(
				StolenCases,
				typeof stolenCase === "number" ? stolenCase : stolenCase.id
			);
			return stolenCase;
		} else {
			assignedOfficer.isAvailable = true;
			await getManager().transaction("SERIALIZABLE", async transactionalEntityManager => {
				await transactionalEntityManager.delete(StolenCases, typeof stolenCase === "number" ? stolenCase : stolenCase.id);
				await transactionalEntityManager.update(Officers, assignedOfficer.id, assignedOfficer);
			});

			return stolenCase;
		}
	}

	async queryCases(stolenCase: StolenCases) {
		const stolenCaseObj = await getManager().findOne(ViwOfficersVstolenCases,{
			where: { stolenCase }
		});
		return stolenCaseObj;
	}

	private async findOfficer(id: number) {
		
		const officerEntityManager = getCustomRepository(OfficerRepository);
		const assignedOfficer = await officerEntityManager.findOneOfficer(
			id
		);
		assignedOfficer.isAvailable = true;

		return assignedOfficer;
	}
}
