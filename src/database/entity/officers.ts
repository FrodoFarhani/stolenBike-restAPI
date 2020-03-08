import {
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	Transaction,
	TransactionRepository,
	Repository
} from "typeorm";
import { IsDate, IsNumber } from "class-validator";

@Entity({ name: "officers" })
export default class Officers {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	@IsDate()
	public deletedAt: Date;

	@Column({ type: "boolean", nullable: false, default: true })
	public isAvailable: boolean;

	@Index()
	@IsNumber()
	@Column({ type: "int", nullable: false })
	public staffCode: number;

	@Transaction({ isolation: "SERIALIZABLE" })
	save(
		officers: Officers,
		@TransactionRepository(Officers) officersRepository?: Repository<Officers>
	) {
		if (officersRepository === undefined) {
			return;
		}
		return officersRepository.save(officers);
	}

	@Transaction({ isolation: "SERIALIZABLE" })
	delete(
		officer: Officers,
		@TransactionRepository(Officers) officersRepository?: Repository<Officers>
	) {
		if (officersRepository === undefined) {
			return;
		}
		return officersRepository.delete(officer);
	}
}
