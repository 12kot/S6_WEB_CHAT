import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1711215614472 implements MigrationInterface {
    name = ' $npmConfigName1711215614472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "created_at"`);
    }

}
