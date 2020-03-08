/* eslint-disable import/prefer-default-export */
import {
	CreateDateColumn,
	Entity,
	Index,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	JoinColumn,
	Transaction,
	TransactionRepository,
	Repository
} from "typeorm";
import { IsString, IsDate, IsNumber } from "class-validator";

import Officers from "./officers";
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
	@Column({ type: "int", nullable: false })
	public licenseNumber: number;

	@Column({ type: "varchar", nullable: false })
	@IsString()
	public color: string;

	@Column({ type: "varchar", nullable: false })
	@IsString()
	public type: string;

	@Column({ type: "varchar", nullable: false })
	@IsString()
	public OwnerName: string;

	@Column({ type: "text", nullable: true })
	@IsString()
	public description?: string;

	@Column({
		type: "enum",
		enum: Status,
		default: Status.ASSESMENT,
		nullable: false
	})
	Status: Status;

	@Column({ type: "int", nullable: false, default: 0 })
	@IsString()
	public officerId: number;

	@OneToOne(() => Officers)
	@JoinColumn({ name: "officerId" })
	public officer: Officers;

	@Transaction({ isolation: "SERIALIZABLE" })
	save(
		stolenCase: StolenCases,
		@TransactionRepository(StolenCases)
		stolenCasesRepository?: Repository<StolenCases>
	) {
		if (stolenCasesRepository === undefined) {
			return;
		}
		return stolenCasesRepository.save(stolenCase);
	}

	@Transaction({ isolation: "SERIALIZABLE" })
	update(
		stolenCase: StolenCases,
		@TransactionRepository(StolenCases)
		stolenCasesRepository?: Repository<StolenCases>
	) {
		if (stolenCasesRepository === undefined) {
			return;
		}
		return stolenCasesRepository.save(stolenCase);
	}
}
