import {
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	OneToOne
	// OneToMany
} from "typeorm";

import StolenCases from "./stolenCases";
// import StolenCasesHistory from "./stolenCasesHistory";

@Entity({ name: "officers" })
export default class Officers {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column({ type: "boolean", nullable: false, default: true })
	public isAvailable: boolean;

	@Index()
	@Column({ type: "int", nullable: false })
	public staffCode: number;

	@OneToOne(
		() => StolenCases,
		(stolenCases: StolenCases) => stolenCases.officer
	)
	public stolenCases: StolenCases;

	// @OneToMany(
	// 	() => StolenCasesHistory,
	// 	(stolenCasesHistory: StolenCasesHistory) => stolenCasesHistory.officers
	// )
	// public officers: Officers[];
}
