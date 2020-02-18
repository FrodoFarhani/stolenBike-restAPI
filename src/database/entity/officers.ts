import {
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	OneToOne
} from "typeorm";

import StolenCases from "./stolenCases";

@Entity({ name: "officers" })
export default class Officers {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Index()
	@Column({ type: "varchar", nullable: true })
	public name: string;

	@OneToOne(
		() => StolenCases,
		(stolenCases: StolenCases) => stolenCases.officers
	)
	public StolenCases: StolenCases;
}
