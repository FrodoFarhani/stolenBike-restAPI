import { EntityRepository, getCustomRepository, getManager } from "typeorm";

import Officers from "../entity/officers";
import BaseRepository from "./BaseRepository";
import StolenCaseRepository from "./stolenCasesRepository";
import StolenCases from "../entity/stolenCases";
import Status from "../../enums/statusEnum";

@EntityRepository(Officers)
export default class OfficersRepository extends BaseRepository<Officers> {
	async createAndSave(officers: Officers): Promise<Officers> {
		const data = await this.save(officers);

		const stolenCaseEntityManager = getCustomRepository(StolenCaseRepository);
		const stolenCaseWithoutOfficer: StolenCases = await stolenCaseEntityManager.findStolenCaseWithoutOfficer();
		if (stolenCaseWithoutOfficer) {
			const stolencaseObject = new StolenCases();
			stolencaseObject.officerId = data.id;
			stolencaseObject.Status = Status.PROCESSING;

			const officerObject = new Officers();
			officerObject.isAvailable = false;

			await getManager().transaction(
				"SERIALIZABLE",
				async transactionalEntityManager => {
					await transactionalEntityManager.update(
						StolenCases,
						stolenCaseWithoutOfficer.id,
						stolencaseObject
					);
					await transactionalEntityManager.update(
						Officers,
						officers.id,
						officerObject
					);
				}
			);
		}

		return officers;
	}

	async allOfficers(): Promise<Officers[]> {
		const officersList = await this.find();
		return officersList;
	}

	async findOneOfficer(id: number | string): Promise<any> {
		console.log("REPO:", id);

		const officerObj = await this.findOne({
			where: { id }
		});
		return officerObj;
	}

	async findFreeOfficer(): Promise<any> {
		const officerObj = await this.findOne({
			where: { isAvailable: true, deletedAt: null }
		});
		return officerObj;
	}

	async deleteOfficers(officer: number | Officers) {
		const officerObj = new Officers();
		officerObj.deletedAt = new Date();

		const stolenCasesObj = new StolenCases();
		stolenCasesObj.officerId = 0;
		stolenCasesObj.Status = Status.ASSESMENT;

		const stolenCaseEntityManager = getCustomRepository(StolenCaseRepository);
		const stolenCaseThisOfficer: StolenCases = await stolenCaseEntityManager.findByOfficerId(
			typeof officer === "number" ? officer : officer.id
		);

		if (!stolenCaseThisOfficer) {
			await this.manager.update(
				Officers,
				typeof officer === "number" ? officer : officer.id,
				officerObj
			);
			return officer;
		}

		await getManager().transaction(
			"SERIALIZABLE",
			async transactionalEntityManager => {
				await this.manager.update(
					Officers,
					typeof officer === "number" ? officer : officer.id,
					officerObj
				);
				await transactionalEntityManager.update(
					StolenCases,
					stolenCaseThisOfficer.id,
					stolenCasesObj
				);
			}
		);
		return officer;
	}
}
