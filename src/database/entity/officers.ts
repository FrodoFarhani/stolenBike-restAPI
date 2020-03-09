import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column
} from "typeorm";
import { IsDate, IsNumber } from "class-validator";

@Entity({ name: "officers" })
export default class Officers {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn({ type: "timestamptz", update: false })
	public createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz", update: false })
	public updatedAt: Date;

	@Column({ nullable: true })
	@IsDate()
	public deletedAt: Date;

	@Column({ type: "boolean", nullable: false, default: true })
	public isAvailable: boolean;

	@IsNumber()
	@Column({ type: "int", default: 0 })
	public staffCode: number;
}
