import { getConnection, Repository } from "typeorm";
import Officers from "../entity/officers";

export default class TestRepository {
	async findOneOfficer(id: number | string): Promise<any> {
		try {
			const testRepository: Repository<Officers> = getConnection().getRepository(
				Officers
			);
			const officerObj = await testRepository.findOne({
				where: { id }
			});

			return officerObj;
		} catch (error) {
			return undefined;
		}
	}
}
