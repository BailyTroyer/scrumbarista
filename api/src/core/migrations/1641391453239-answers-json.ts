import { MigrationInterface, QueryRunner } from "typeorm";

export class answersJson1641391453239 implements MigrationInterface {
  name = "answersJson1641391453239";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`checkin\` DROP COLUMN \`answers\``);
    await queryRunner.query(
      `ALTER TABLE \`checkin\` ADD \`answers\` json NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`checkin\` DROP COLUMN \`answers\``);
    await queryRunner.query(
      `ALTER TABLE \`checkin\` ADD \`answers\` text NOT NULL`
    );
  }
}
