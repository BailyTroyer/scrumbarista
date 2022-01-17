import {MigrationInterface, QueryRunner} from "typeorm";

export class addDefaultTimezonesAndOverride1642120885487 implements MigrationInterface {
    name = 'addDefaultTimezonesAndOverride1642120885487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`timezone_override\` (\`userId\` varchar(255) NOT NULL, \`timezone\` enum ('GMT', 'UTC', 'ECT', 'EET', 'ART', 'EAT', 'MET', 'NET', 'PLT', 'IST', 'BST', 'VST', 'CTT', 'JST', 'ACT', 'AET', 'SST', 'NST', 'MIT', 'HST', 'AST', 'PST', 'PNT', 'MST', 'CST', 'EST', 'IET', 'PRT', 'CNT', 'AGT', 'BET', 'CAT') NOT NULL DEFAULT 'CST', \`standupChannelId\` varchar(255) NULL, PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`standup\` ADD \`timezone\` enum ('GMT', 'UTC', 'ECT', 'EET', 'ART', 'EAT', 'MET', 'NET', 'PLT', 'IST', 'BST', 'VST', 'CTT', 'JST', 'ACT', 'AET', 'SST', 'NST', 'MIT', 'HST', 'AST', 'PST', 'PNT', 'MST', 'CST', 'EST', 'IET', 'PRT', 'CNT', 'AGT', 'BET', 'CAT') NOT NULL DEFAULT 'CST'`);
        await queryRunner.query(`ALTER TABLE \`timezone_override\` ADD CONSTRAINT \`FK_30315d78e4859a1de6bcdaa4bbe\` FOREIGN KEY (\`standupChannelId\`) REFERENCES \`standup\`(\`channelId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`timezone_override\` DROP FOREIGN KEY \`FK_30315d78e4859a1de6bcdaa4bbe\``);
        await queryRunner.query(`ALTER TABLE \`standup\` DROP COLUMN \`timezone\``);
        await queryRunner.query(`DROP TABLE \`timezone_override\``);
    }

}
