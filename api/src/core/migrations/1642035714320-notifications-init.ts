import {MigrationInterface, QueryRunner} from "typeorm";

export class notificationsInit1642035714320 implements MigrationInterface {
    name = 'notificationsInit1642035714320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`interval\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`notification\``);
    }

}
