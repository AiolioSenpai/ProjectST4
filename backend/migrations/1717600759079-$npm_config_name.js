import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717600759079 {
    name = ' $npmConfigName1717600759079'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "rating" (
                "id_movie" integer NOT NULL,
                "id_user" integer NOT NULL,
                "rate" varchar NOT NULL,
                PRIMARY KEY ("id_movie", "id_user")
            )
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
            CREATE TABLE "genre" (
                "id_genre" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "genre_type" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "actor" (
                "id_actor" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "actor_name" varchar NOT NULL,
                "image" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_genre" (
                "id_movie" integer NOT NULL,
                "id_genre" integer NOT NULL,
                PRIMARY KEY ("id_movie", "id_genre")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b6eab9cfd28e49be3302fd1866" ON "movie_genre" ("id_movie")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fd632084f206f8f00f33acf966" ON "movie_genre" ("id_genre")
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
            CREATE TABLE "temporary_user" (
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"("email", "firstname", "lastname")
            SELECT "email",
                "firstname",
                "lastname"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user" (
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "id_user" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "password" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"("email", "firstname", "lastname")
            SELECT "email",
                "firstname",
                "lastname"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_rating" (
                "id_movie" integer NOT NULL,
                "id_user" integer NOT NULL,
                "rate" varchar NOT NULL,
                CONSTRAINT "FK_ef112d1afb6ce98b122fbc93062" FOREIGN KEY ("id_movie") REFERENCES "movie" ("id_movie") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_280489b21204a6a9a7ca4bd5fc0" FOREIGN KEY ("id_user") REFERENCES "user" ("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("id_movie", "id_user")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_rating"("id_movie", "id_user", "rate")
            SELECT "id_movie",
                "id_user",
                "rate"
            FROM "rating"
        `);
        await queryRunner.query(`
            DROP TABLE "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_rating"
                RENAME TO "rating"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b6eab9cfd28e49be3302fd1866"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_fd632084f206f8f00f33acf966"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie_genre" (
                "id_movie" integer NOT NULL,
                "id_genre" integer NOT NULL,
                CONSTRAINT "FK_b6eab9cfd28e49be3302fd18661" FOREIGN KEY ("id_movie") REFERENCES "movie" ("id_movie") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_fd632084f206f8f00f33acf9667" FOREIGN KEY ("id_genre") REFERENCES "genre" ("id_genre") ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY ("id_movie", "id_genre")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie_genre"("id_movie", "id_genre")
            SELECT "id_movie",
                "id_genre"
            FROM "movie_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_genre"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie_genre"
                RENAME TO "movie_genre"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b6eab9cfd28e49be3302fd1866" ON "movie_genre" ("id_movie")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fd632084f206f8f00f33acf966" ON "movie_genre" ("id_genre")
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
            DROP INDEX "IDX_fd632084f206f8f00f33acf966"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b6eab9cfd28e49be3302fd1866"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie_genre"
                RENAME TO "temporary_movie_genre"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_genre" (
                "id_movie" integer NOT NULL,
                "id_genre" integer NOT NULL,
                PRIMARY KEY ("id_movie", "id_genre")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie_genre"("id_movie", "id_genre")
            SELECT "id_movie",
                "id_genre"
            FROM "temporary_movie_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie_genre"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fd632084f206f8f00f33acf966" ON "movie_genre" ("id_genre")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b6eab9cfd28e49be3302fd1866" ON "movie_genre" ("id_movie")
        `);
        await queryRunner.query(`
            ALTER TABLE "rating"
                RENAME TO "temporary_rating"
        `);
        await queryRunner.query(`
            CREATE TABLE "rating" (
                "id_movie" integer NOT NULL,
                "id_user" integer NOT NULL,
                "rate" varchar NOT NULL,
                PRIMARY KEY ("id_movie", "id_user")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "rating"("id_movie", "id_user", "rate")
            SELECT "id_movie",
                "id_user",
                "rate"
            FROM "temporary_rating"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"("email", "firstname", "lastname")
            SELECT "email",
                "firstname",
                "lastname"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"("email", "firstname", "lastname")
            SELECT "email",
                "firstname",
                "lastname"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
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
            DROP INDEX "IDX_fd632084f206f8f00f33acf966"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b6eab9cfd28e49be3302fd1866"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "actor"
        `);
        await queryRunner.query(`
            DROP TABLE "genre"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "rating"
        `);
    }
}
