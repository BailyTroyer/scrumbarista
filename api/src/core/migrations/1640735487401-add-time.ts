import { MigrationInterface, QueryRunner } from "typeorm";

export class addTime1640735487401 implements MigrationInterface {
  name = "addTime1640735487401";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`standup\` ADD \`startTime\` time NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`standup\` DROP COLUMN \`startTime\``
    );
  }
}
