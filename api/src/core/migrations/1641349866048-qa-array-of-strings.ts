import { MigrationInterface, QueryRunner } from "typeorm";

export class qaArrayOfStrings1641349866048 implements MigrationInterface {
  name = "qaArrayOfStrings1641349866048";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`standup\` DROP COLUMN \`questions\``
    );
    await queryRunner.query(
      `ALTER TABLE \`standup\` ADD \`questions\` text NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE \`checkin\` DROP COLUMN \`answers\``);
    await queryRunner.query(
      `ALTER TABLE \`checkin\` ADD \`answers\` text NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`checkin\` DROP COLUMN \`answers\``);
    await queryRunner.query(
      `ALTER TABLE \`checkin\` ADD \`answers\` varchar(255) NOT NULL DEFAULT ''`
    );
    await queryRunner.query(
      `ALTER TABLE \`standup\` DROP COLUMN \`questions\``
    );
    await queryRunner.query(
      `ALTER TABLE \`standup\` ADD \`questions\` varchar(255) NOT NULL DEFAULT ''`
    );
  }
}
