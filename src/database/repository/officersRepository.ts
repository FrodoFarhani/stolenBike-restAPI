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
			stolenCaseWithoutOfficer.officerId = data.id;
			stolenCaseWithoutOfficer.Status = Status.PROCESSING;

			await getManager().transaction(
				"SERIALIZABLE",
				async transactionalEntityManager => {
					await transactionalEntityManager.update(
						StolenCases,
						stolenCaseWithoutOfficer.id,
						stolenCaseWithoutOfficer
					);
					await transactionalEntityManager.update(
						Officers,
						officers.id,
						officers
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

	async findOneOfficer(id: number): Promise<any> {
		const officerObj = await this.findOne({
			where: { id }
		});
		return officerObj;
	}

	async findFreeOfficer(): Promise<any> {
		const officerObj = await this.findOne({
			where: { isAvailable: true }
		});
		return officerObj;
	}

	async deleteOfficers(officer: number | Officers) {
		const stolenCaseEntityManager = getCustomRepository(StolenCaseRepository);
		const stolenCaseThisOfficer: StolenCases = await stolenCaseEntityManager.findByOfficerId(
			typeof officer === "number" ? officer : officer.id
		);

		if (!stolenCaseThisOfficer) {
			await this.manager.delete(
				Officers,
				typeof officer === "number" ? officer : officer.id
			);
			return officer;
		}

		stolenCaseThisOfficer.officerId = 0;
		stolenCaseThisOfficer.Status = Status.ASSESMENT;

		await getManager().transaction(
			"SERIALIZABLE",
			async transactionalEntityManager => {
				await transactionalEntityManager.delete(
					Officers,
					typeof officer === "number" ? officer : officer.id
				);
				await transactionalEntityManager.update(
					StolenCases,
					stolenCaseThisOfficer.id,
					stolenCaseThisOfficer
				);
			}
		);
		return officer;
	}
}
