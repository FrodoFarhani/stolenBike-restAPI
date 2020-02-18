/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from "typeorm";

export default class Officers1582054108018 implements MigrationInterface {
	name = "officers1582054108018";

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			`CREATE TABLE "stolenCases" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "stolenDate" TIMESTAMP NOT NULL, "licenseNumber" integer NOT NULL, "color" character varying NOT NULL, "type" character varying NOT NULL, "OwnerName" character varying NOT NULL, "description" text, "officerId" integer, CONSTRAINT "PK_4775e5e8816f24d1e47486bdb2e" PRIMARY KEY ("id"))`,
			undefined
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_6448106521fc73b3bc8016b4f4" ON "stolenCases" ("licenseNumber") `,
			undefined
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_12976b14253ce46a2d78e256cc" ON "stolenCases" ("officerId") `,
			undefined
		);
		await queryRunner.query(
			`CREATE TABLE "officers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, CONSTRAINT "PK_51b2f6e36c3acee541c66bf4047" PRIMARY KEY ("id"))`,
			undefined
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_e0f84ac59f6138659494e34722" ON "officers" ("name") `,
			undefined
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			`DROP INDEX "IDX_e0f84ac59f6138659494e34722"`,
			undefined
		);
		await queryRunner.query(`DROP TABLE "officers"`, undefined);
		await queryRunner.query(
			`DROP INDEX "IDX_12976b14253ce46a2d78e256cc"`,
			undefined
		);
		await queryRunner.query(
			`DROP INDEX "IDX_6448106521fc73b3bc8016b4f4"`,
			undefined
		);
		await queryRunner.query(`DROP TABLE "stolenCases"`, undefined);
	}
}
