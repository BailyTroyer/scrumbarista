import { MigrationInterface, QueryRunner } from "typeorm";

export class baseNotificationEntity1642435903949 implements MigrationInterface {
  name = "baseNotificationEntity1642435903949";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`standup_notification\` (\`channelId\` varchar(255) NOT NULL DEFAULT '', \`interval\` varchar(255) NOT NULL, PRIMARY KEY (\`channelId\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`user_standup_notification\` (\`channelId\` varchar(255) NOT NULL DEFAULT '', \`interval\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_bd2e700dceee82b3e591beec62\` (\`userId\`), PRIMARY KEY (\`channelId\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_bd2e700dceee82b3e591beec62\` ON \`user_standup_notification\``
    );
    await queryRunner.query(`DROP TABLE \`user_standup_notification\``);
    await queryRunner.query(`DROP TABLE \`standup_notification\``);
  }
}
