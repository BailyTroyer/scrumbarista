import { MigrationInterface, QueryRunner } from "typeorm";

export class introMessage1640787558513 implements MigrationInterface {
  name = "introMessage1640787558513";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`standup\` ADD \`introMessage\` varchar(255) NOT NULL DEFAULT ''`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`standup\` DROP COLUMN \`introMessage\``
    );
  }
}
