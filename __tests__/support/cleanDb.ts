import { getConnection } from "typeorm";

export const clean = () => {
	const { manager } = getConnection();
	const names = ["stolenCases", "officers"];
	return manager.query(names.map(name => `delete from public."${name}";`).join("\n"));
};
