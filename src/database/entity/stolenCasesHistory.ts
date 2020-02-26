/* eslint-disable import/prefer-default-export */
import {
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	JoinColumn,
	ManyToOne
} from "typeorm";

import Officers from "./officers";
import StolenCases from "./stolenCases";

@Entity({ name: "stolenCasesHistory" })
export default class StolenCasesHistory {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Index()
	@Column({ type: "int", nullable: true })
	public officerId: number;

	@ManyToOne(
		() => Officers,
		(officers: Officers) => officers.stolenCasesHistorys
	)
	@JoinColumn({ name: "officerId" })
	public officers: Officers;

	@Index()
	@Column({ type: "int", nullable: true })
	public stolenCaseId: number;

	@ManyToOne(
		() => StolenCases,
		(stolenCases: StolenCases) => stolenCases.stolenCasesHistorys
	)
	@JoinColumn({ name: "stolenCaseId" })
	public stolenCases: StolenCases;
}
