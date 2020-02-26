/* eslint-disable import/prefer-default-export */
import {
	CreateDateColumn,
	Entity,
	Index,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	JoinColumn
	// OneToMany
} from "typeorm";

import Officers from "./officers";
// import StolenCasesHistory from "./stolenCasesHistory";
import Status from "../../enums/statusEnum";

@Entity({ name: "stolenCases" })
export default class StolenCases {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: "timestamp" })
	public stolenDate: Date;

	@Index()
	@Column({ type: "int", nullable: false })
	public licenseNumber: string;

	@Column({ type: "varchar", nullable: false })
	public color: string;

	@Column({ type: "varchar", nullable: false })
	public type: string;

	@Column({ type: "varchar", nullable: false })
	public OwnerName: string;

	@Column({ type: "text", nullable: true })
	public description?: string;

	@Column({
		type: "enum",
		enum: Status,
		default: Status.ASSESMENT
	})
	Status: Status;

	@Column({ type: "int", nullable: true })
	public officerId?: number;

	@OneToOne(
		() => Officers,
		(officers: Officers) => officers.stolenCases
	)
	@JoinColumn({ name: "officerId" })
	public officer: Officers;

	// @OneToMany(
	// 	() => StolenCasesHistory,
	// 	(stolenCasesHistory: StolenCasesHistory) => stolenCasesHistory.stolenCases
	// )
	// public stolenCasesHistorys: StolenCasesHistory[];
}
