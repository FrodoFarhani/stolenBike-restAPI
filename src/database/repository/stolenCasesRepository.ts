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

	async caseResolved(stolenCase: StolenCases): Promise<StolenCases> {
		const stolenCaseObj = new StolenCases();
		stolenCaseObj.officerId = 0;
		stolenCaseObj.Status = Status.RESOLVED;

		const officerEntityManager = getCustomRepository(OfficerRepository);
		const assignedOfficer: Officers = await officerEntityManager.findOneOfficer(
			stolenCase.officerId
		);

		if (!assignedOfficer) {
			await this.manager.update(StolenCases, stolenCase.id, stolenCaseObj);
			return stolenCase;
		}

		const officerObj = new Officers();
		officerObj.isAvailable = true;

		await getManager().transaction(
			"SERIALIZABLE",
			async transactionalEntityManager => {
				await transactionalEntityManager.update(
					StolenCases,
					stolenCase.id,
					stolenCaseObj
				);
				await transactionalEntityManager.update(
					Officers,
					assignedOfficer.id,
					officerObj
				);
			}
		);

		return stolenCase;
	}

	async deleteStolenCase(stolenCase: number | StolenCases) {
		const officerEntityManager = getCustomRepository(OfficerRepository);
		const assignedOfficer: Officers = await officerEntityManager.findOneOfficer(
			typeof stolenCase === "number" ? stolenCase : stolenCase.officerId
		);

		if (!assignedOfficer) {
			await this.manager.delete(
				StolenCases,
				typeof stolenCase === "number" ? stolenCase : stolenCase.id
			);
			return stolenCase;
		}

		const officerObj = new Officers();
		officerObj.isAvailable = true;

		await getManager().transaction(
			"SERIALIZABLE",
			async transactionalEntityManager => {
				await transactionalEntityManager.delete(
					StolenCases,
					typeof stolenCase === "number" ? stolenCase : stolenCase.id
				);
				await transactionalEntityManager.update(
					Officers,
					assignedOfficer.id,
					officerObj
				);
			}
		);

		return stolenCase;
	}

	async queryCases(stolenCase: StolenCases) {
		const stolenCaseObj = await getManager().find(ViwOfficersVstolenCases, {
			where: stolenCase
		});
		return stolenCaseObj;
	}
}
