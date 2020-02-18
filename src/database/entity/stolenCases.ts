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
} from "typeorm";

import Officers from "./officers";

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
	@Column({ type: "int" })
	public licenseNumber: string;

	@Column({ type: "varchar" })
	public color: string;

	@Column({ type: "varchar" })
	public type: string;

	@Column({ type: "varchar" })
	public OwnerName: string;

	@Column({ type: "text", nullable: true })
	public description?: string;

	@Index()
	@Column({ type: "int", nullable: true })
	public officerId?: number;

	@JoinColumn({ name: "officerId" })
	public officers: Officers;

	@OneToOne(
		() => Officers,
		(officers: Officers) => officers.id
	)
	public officer: Officers;
}
