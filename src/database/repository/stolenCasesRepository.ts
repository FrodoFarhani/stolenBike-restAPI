import { EntityRepository, getManager, getCustomRepository } from "typeorm";

import StolenCases from "../entity/stolenCases";
import BaseRepository from "./BaseRepository";
import Officers from "../entity/officers";
import ViwOfficersVstolenCases from "../views/viw_officersVstolenCases";
import Status from "../../enums/statusEnum";
import OfficerRepository from "./officersRepository";

@EntityRepository(StolenCases)
export default class StolenCaseRepository extends BaseRepository<StolenCases> {
	async createAndSave(stolenCase: StolenCases): Promise<StolenCases> {
		const officerEntityManager = getCustomRepository(OfficerRepository);
		const freeOfficer: Officers = await officerEntityManager.findFreeOfficer();
		const updateObj: Officers = new Officers();

		if (!freeOfficer) {
			await this.manager.save(stolenCase);
		} else {
			stolenCase.officerId = freeOfficer.id;
			stolenCase.Status = Status.PROCESSING;
			updateObj.isAvailable = false;

			await getManager().transaction(
				"SERIALIZABLE",
				async transactionalEntityManager => {
					await transactionalEntityManager.save(stolenCase);
					await transactionalEntityManager.update(
						Officers,
						freeOfficer.id,
						updateObj
					);
				}
			);
		}

		return stolenCase;
	}

	async allStolenCases(): Promise<StolenCases[]> {
		const stolenCasesList = await this.find();
		return stolenCasesList;
	}

	async findOneStolenCase(id: number | string): Promise<any> {
		const stolenCaseObj = await this.findOne({
			where: { id }
		});
		return stolenCaseObj;
	}

	async findByOfficerId(officerId: number | string): Promise<any> {
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

	async caseResolved(id: number | string): Promise<StolenCases | undefined> {
		const stolenCaseObj = new StolenCases();
		stolenCaseObj.officerId = 0;
		stolenCaseObj.Status = Status.RESOLVED;

		const findObject = await this.findOneStolenCase(id);
		if (!findObject) return undefined;

		const officerEntityManager = getCustomRepository(OfficerRepository);
		const assignedOfficer: Officers = await officerEntityManager.findOneOfficer(
			findObject.officerId
		);

		if (!assignedOfficer) {
			await this.manager.update(StolenCases, id, stolenCaseObj);
			return stolenCaseObj;
		}
		const officerObj = new Officers();
		officerObj.isAvailable = true;

		await getManager().transaction(
			"SERIALIZABLE",
			async transactionalEntityManager => {
				await transactionalEntityManager.update(StolenCases, id, stolenCaseObj);
				await transactionalEntityManager.update(
					Officers,
					assignedOfficer.id,
					officerObj
				);
			}
		);

		return stolenCaseObj;
	}

	async deleteStolenCase(stolenCase: number | string) {
		const officerEntityManager = getCustomRepository(OfficerRepository);
		const assignedOfficer: Officers = await officerEntityManager.findOneOfficer(
			stolenCase
		);

		if (!assignedOfficer) {
			await this.manager.delete(StolenCases, stolenCase);
			return stolenCase;
		}

		const officerObj = new Officers();
		officerObj.isAvailable = true;

		await getManager().transaction(
			"SERIALIZABLE",
			async transactionalEntityManager => {
				await transactionalEntityManager.delete(StolenCases, stolenCase);
				await transactionalEntityManager.update(
					Officers,
					assignedOfficer.id,
					officerObj
				);
			}
		);

		return stolenCase;
	}

	async queryCases(query: string) {
		const stolenCaseObj = await getManager().find(ViwOfficersVstolenCases, {
			where: { query }
		});
		return stolenCaseObj;
	}
}
