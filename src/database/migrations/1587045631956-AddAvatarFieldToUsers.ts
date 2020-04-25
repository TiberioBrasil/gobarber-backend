import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddAvatarFieldToUsers1587045631956
  implements MigrationInterface {
  name = 'AddAvatarFieldToUsers1587045631956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar" character varying`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "avatar"`,
      undefined,
    );
  }
}
