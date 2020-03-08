import { EntityRepository, Repository } from "typeorm";
import StolenCases from "../entity/stolenCases";

@EntityRepository(StolenCases)
export default class StolenCaseRepository extends Repository<StolenCases> {
	async createAndSave(stolenCases: StolenCases): Promise<number> {
		const stolenCaseObj = new StolenCases();
		stolenCaseObj.OwnerName = stolenCases.OwnerName;
		stolenCaseObj.licenseNumber = stolenCases.licenseNumber;
		stolenCaseObj.color = stolenCases.color;
		stolenCaseObj.type = stolenCases.type;
		stolenCaseObj.description = stolenCases.description;
		stolenCaseObj.stolenDate = stolenCases.stolenDate;
		await this.save(stolenCaseObj);
		return stolenCaseObj.id;
	}

	async allStolenCases(): Promise<StolenCases[]> {
		const stolenCasesList = await this.find();
		return stolenCasesList;
	}

	async findOneStolenCase(id: number): Promise<StolenCases | undefined> {
		const stolenCaseObj = await this.findOne({
			where: { id }
		});
		return stolenCaseObj;
	}
    async findByOfficerId(officerId: number): Promise<StolenCases | undefined> {
		const stolenCaseObj = await this.findOne({
			where: { officerId }
		});
		return stolenCaseObj;
	}

	async findStolenCaseWithoutOfficer(): Promise<StolenCases | undefined> {
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

	async deleteStolenCase(stolenCase: number | StolenCases) {
		await this.manager.delete(
			StolenCases,
			typeof stolenCase === "number" ? stolenCase : stolenCase.id
		);
	}
}
