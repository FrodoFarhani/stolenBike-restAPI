import { Factory } from "typeorm-factory";

import { OfficersFactory } from "./officersFactory";
import StolenCases from "../../src/database/entity/stolenCases";

export const StolenCasesFactory = new Factory<StolenCases>(
	StolenCases
).assocOne("officer", OfficersFactory);
