import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717663677662 {
    name = ' $npmConfigName1717663677662'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "genre" (
                "id_genre" integer PRIMARY KEY NOT NULL,
                "genre_type" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "actor" (
                "id_actor" integer PRIMARY KEY NOT NULL,
                "actor_name" varchar NOT NULL,
                "image" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "cast" (
                "id_movie" integer NOT NULL,
                "id_actor" integer NOT NULL,
                PRIMARY KEY ("id_movie", "id_actor")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_5eacd77bcf269e1ceecd3ff8bf" ON "cast" ("id_movie")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a0c2afbeb36960679c990a2e54" ON "cast" ("id_actor")
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id_movie" integer PRIMARY KEY NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "trailer" varchar NOT NULL,
                "image" varchar NOT NULL,
                "rating_tmdb" varchar NOT NULL,
                "description" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id_movie",
                    "title",
                    "release_date",
                    "trailer",
                    "image",
                    "rating_tmdb"
                )
            SELECT "id_movie",
                "title",
                "release_date",
                "trailer",
                "image",
                "rating_tmdb"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_5eacd77bcf269e1ceecd3ff8bf"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_a0c2afbeb36960679c990a2e54"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_cast" (
                "id_movie" integer NOT NULL,
                "id_actor" integer NOT NULL,
                CONSTRAINT "FK_5eacd77bcf269e1ceecd3ff8bfe" FOREIGN KEY ("id_movie") REFERENCES "movie" ("id_movie") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_a0c2afbeb36960679c990a2e549" FOREIGN KEY ("id_actor") REFERENCES "actor" ("id_actor") ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY ("id_movie", "id_actor")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_cast"("id_movie", "id_actor")
            SELECT "id_movie",
                "id_actor"
            FROM "cast"
        `);
        await queryRunner.query(`
            DROP TABLE "cast"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_cast"
                RENAME TO "cast"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_5eacd77bcf269e1ceecd3ff8bf" ON "cast" ("id_movie")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a0c2afbeb36960679c990a2e54" ON "cast" ("id_actor")
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP INDEX "IDX_a0c2afbeb36960679c990a2e54"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_5eacd77bcf269e1ceecd3ff8bf"
        `);
        await queryRunner.query(`
            ALTER TABLE "cast"
                RENAME TO "temporary_cast"
        `);
        await queryRunner.query(`
            CREATE TABLE "cast" (
                "id_movie" integer NOT NULL,
                "id_actor" integer NOT NULL,
                PRIMARY KEY ("id_movie", "id_actor")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "cast"("id_movie", "id_actor")
            SELECT "id_movie",
                "id_actor"
            FROM "temporary_cast"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_cast"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a0c2afbeb36960679c990a2e54" ON "cast" ("id_actor")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_5eacd77bcf269e1ceecd3ff8bf" ON "cast" ("id_movie")
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id_movie" integer PRIMARY KEY NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "trailer" varchar NOT NULL,
                "image" varchar NOT NULL,
                "rating_tmdb" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id_movie",
                    "title",
                    "release_date",
                    "trailer",
                    "image",
                    "rating_tmdb"
                )
            SELECT "id_movie",
                "title",
                "release_date",
                "trailer",
                "image",
                "rating_tmdb"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_a0c2afbeb36960679c990a2e54"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_5eacd77bcf269e1ceecd3ff8bf"
        `);
        await queryRunner.query(`
            DROP TABLE "cast"
        `);
        await queryRunner.query(`
            DROP TABLE "actor"
        `);
        await queryRunner.query(`
            DROP TABLE "genre"
        `);
    }
}
