import { MigrationInterface, QueryRunner } from "typeorm";

export class outOfOffice1644631574416 implements MigrationInterface {
  name = "outOfOffice1644631574416";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`checkin\` ADD \`outOfOffice\` tinyint NOT NULL DEFAULT 0`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`checkin\` DROP COLUMN \`outOfOffice\``
    );
  }
}
