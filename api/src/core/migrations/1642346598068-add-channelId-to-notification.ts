import {MigrationInterface, QueryRunner} from "typeorm";

export class addChannelIdToNotification1642346598068 implements MigrationInterface {
    name = 'addChannelIdToNotification1642346598068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`id\` \`channelId\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`channelId\` \`channelId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`channelId\``);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD \`channelId\` varchar(255) NOT NULL PRIMARY KEY DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`channelId\``);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD \`channelId\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD PRIMARY KEY (\`channelId\`)`);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`channelId\` \`channelId\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`channelId\` \`id\` int NOT NULL AUTO_INCREMENT`);
    }

}
