import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717591808521 {
    name = ' $npmConfigName1717591808521'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "movie_db" (
                "id" integer PRIMARY KEY NOT NULL,
                "title" varchar NOT NULL,
                "vote_average" float NOT NULL,
                "poster_path" varchar NOT NULL,
                "genre_ids" integer array NOT NULL,
                "overview" varchar NOT NULL,
                "release_date" varchar NOT NULL
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "movie_db"
        `);
    }
}
