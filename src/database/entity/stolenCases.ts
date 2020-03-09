/* eslint-disable import/prefer-default-export */
import {
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column
} from "typeorm";

import { IsString, IsDate, IsNumber } from "class-validator";
import Status from "../../enums/statusEnum";

@Entity({ name: "stolenCases" })
export default class StolenCases {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: "timestamp", nullable: false })
	@IsDate()
	public stolenDate: Date;

	@Index()
	@IsNumber()
	@Column({ type: "int", nullable: false, default: 123 })
	public licenseNumber: number;

	@Column({ type: "varchar", nullable: true, default: "" })
	@IsString()
	public color: string;

	@Column({ type: "varchar", nullable: true, default: "" })
	@IsString()
	public type: string;

	@Column({ type: "varchar", nullable: true, default: "" })
	@IsString()
	public OwnerName: string;

	@Column({ type: "text", nullable: true })
	@IsString()
	public description: string;

	@Column({
		type: "enum",
		enum: Status,
		default: Status.ASSESMENT,
		nullable: false
	})
	Status: Status;

	@Column({ type: "int", nullable: false, default: 0 })
	@IsNumber()
	public officerId: number;
}
