import { MigrationInterface, QueryRunner } from "typeorm";

export class init1640211331557 implements MigrationInterface {
  name = "init1640211331557";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`day\` (\`id\` int NOT NULL AUTO_INCREMENT, \`day\` enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL, \`standupChannelId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`standup\` (\`channelId\` varchar(255) NOT NULL DEFAULT '', \`name\` varchar(255) NOT NULL DEFAULT '', \`questions\` varchar(255) NOT NULL DEFAULT '', PRIMARY KEY (\`channelId\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`checkin\` (\`id\` varchar(36) NOT NULL, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`answers\` varchar(255) NOT NULL DEFAULT '', \`postMessageTs\` varchar(255) NOT NULL DEFAULT '', \`userId\` varchar(255) NOT NULL, \`standupChannelId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`day\` ADD CONSTRAINT \`FK_0f25d0a6840661802e94ebd66d6\` FOREIGN KEY (\`standupChannelId\`) REFERENCES \`standup\`(\`channelId\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`checkin\` ADD CONSTRAINT \`FK_7de64f92cab96306c2613f71bf5\` FOREIGN KEY (\`standupChannelId\`) REFERENCES \`standup\`(\`channelId\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`checkin\` DROP FOREIGN KEY \`FK_7de64f92cab96306c2613f71bf5\``
    );
    await queryRunner.query(
      `ALTER TABLE \`day\` DROP FOREIGN KEY \`FK_0f25d0a6840661802e94ebd66d6\``
    );
    await queryRunner.query(`DROP TABLE \`checkin\``);
    await queryRunner.query(`DROP TABLE \`standup\``);
    await queryRunner.query(`DROP TABLE \`day\``);
  }
}
