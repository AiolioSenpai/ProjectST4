import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717492488510 {
    name = ' $npmConfigName1717492488510'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
    }
}
