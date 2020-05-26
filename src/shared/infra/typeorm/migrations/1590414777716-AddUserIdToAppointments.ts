import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddUserIdToAppointments1590414777716
  implements MigrationInterface {
  name = 'AddUserIdToAppointments1590414777716';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "user_id" uuid`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_66dee3bea82328659a4db8e54b7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_66dee3bea82328659a4db8e54b7"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "user_id"`,
      undefined,
    );
  }
}
