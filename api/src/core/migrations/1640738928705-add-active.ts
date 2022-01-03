import { MigrationInterface, QueryRunner } from "typeorm";

export class addActive1640738928705 implements MigrationInterface {
  name = "addActive1640738928705";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`standup\` ADD \`active\` tinyint NOT NULL DEFAULT 1`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`standup\` DROP COLUMN \`active\``);
  }
}
