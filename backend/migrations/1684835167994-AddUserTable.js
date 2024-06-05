import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class AddUserTable1684835167994 {
    name = 'AddUserTable1684835167994'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }
}
