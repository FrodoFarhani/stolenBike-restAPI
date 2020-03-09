import { Factory } from "typeorm-factory";
import Officers from "../../src/database/entity/officers";

export const OfficersFactory = new Factory<Officers>(Officers);
