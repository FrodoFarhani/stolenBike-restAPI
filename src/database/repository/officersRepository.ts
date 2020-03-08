import { EntityRepository, Repository } from "typeorm";

import Officers from "../entity/officers";

@EntityRepository(Officers)
export default class OfficersRepository extends Repository<Officers> {
	async createAndSave(officers: Officers): Promise<number> {
		const officerObj = new Officers();
		officerObj.isAvailable = true;
		officerObj.staffCode = officers.staffCode;

		await this.save(officerObj);
		return officerObj.id;
	}

	async allOfficers(): Promise<Officers[]> {
		const officersList = await this.find();
		return officersList;
	}

	async findOneOfficer(id: number): Promise<Officers | undefined> {
		const officerObj = await this.findOne({
			where: { id }
		});
		return officerObj;
	}

	async findFreeOfficer(): Promise<Officers | undefined> {
		const officerObj = await this.findOne({
			where: { isAvailable: true }
		});
		return officerObj;
	}

	async updateOfficers(id: number, officer: Officers): Promise<number> {
		await this.manager.update(Officers, id, officer);
		return id;
	}

	async deleteOfficers(officer: number | Officers) {
		await this.manager.delete(
			Officers,
			typeof officer === "number" ? officer : officer.id
		);
	}
}
