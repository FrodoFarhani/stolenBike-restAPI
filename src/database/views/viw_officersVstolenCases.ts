import { ViewEntity, ViewColumn, Connection } from "typeorm";

import Officers from "../entity/officers";
import StolenCases from "../entity/stolenCases";

@ViewEntity({
	expression: (connection: Connection) =>
		connection
			.createQueryBuilder()
			.select("stolenCases.createdAt", "createdAt")
			.addSelect("stolenCases.stolenDate", "stolenDate")
			.addSelect("stolenCases.licenseNumber", "licenseNumber")
			.addSelect("stolenCases.color", "color")
			.addSelect("stolenCases.type", "type")
			.addSelect("stolenCases.OwnerName", "OwnerName")
			.addSelect("stolenCases.description", "description")
			.addSelect("officers.staffCode", "staffCode")
			.from(StolenCases, "stolenCases")
			.leftJoin(Officers, "officers", "officers.id = stolenCases.officerId")
})
export default class ViwOfficersVstolenCases {
	@ViewColumn()
	public createdAt: Date;

	@ViewColumn()
	public stolenDate: Date;

	@ViewColumn()
	public licenseNumber: string;

	@ViewColumn()
	public color: string;

	@ViewColumn()
	public type: string;

	@ViewColumn()
	public OwnerName: string;

	@ViewColumn()
	public description?: string;

	@ViewColumn()
	public staffCode: number;
}
