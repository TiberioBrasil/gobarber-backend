import { MigrationInterface, QueryRunner } from 'typeorm';

export default class UpateAppointments1587038030126
  implements MigrationInterface {
  name = 'UpateAppointments1587038030126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" RENAME COLUMN "provider" TO "provider_id"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "provider_id"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "provider_id" uuid`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_e3e268ed1125872144e68b9a41c" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_e3e268ed1125872144e68b9a41c"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "provider_id"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "provider_id" character varying NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" RENAME COLUMN "provider_id" TO "provider"`,
      undefined,
    );
  }
}
