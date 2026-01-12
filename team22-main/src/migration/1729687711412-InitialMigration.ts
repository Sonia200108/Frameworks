import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1729687711412 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "person" (
                "id" int NOT NULL AUTO_INCREMENT, 
                "name" varchar(255) NOT NULL, 
                "age" int NOT NULL, 
                PRIMARY KEY ("id")
            );

            CREATE TABLE "family" (
                "id" int NOT NULL AUTO_INCREMENT, 
                "parent1Id" int, 
                "parent2Id" int, 
                PRIMARY KEY ("id")
            );

            CREATE TABLE "parent" (
                "id" int NOT NULL, 
                "familyId" int, 
                PRIMARY KEY ("id"), 
                CONSTRAINT "FK_family_parent1" FOREIGN KEY ("id") REFERENCES "person"("id")
            );

            CREATE TABLE "child" (
                "id" int NOT NULL, 
                "familyId" int, 
                "classId" int, 
                PRIMARY KEY ("id"), 
                CONSTRAINT "FK_child_person" FOREIGN KEY ("id") REFERENCES "person"("id"), 
                CONSTRAINT "FK_family_child" FOREIGN KEY ("familyId") REFERENCES "family"("id")
            );

            CREATE TABLE "class" (
                "id" int NOT NULL AUTO_INCREMENT, 
                "year" int NOT NULL, 
                "className" varchar(255) NOT NULL, 
                "teacherId" int, 
                PRIMARY KEY ("id")
            );

            CREATE TABLE "teacher" (
                "id" int NOT NULL, 
                PRIMARY KEY ("id"), 
                CONSTRAINT "FK_teacher_person" FOREIGN KEY ("id") REFERENCES "person"("id")
            );

            ALTER TABLE "family"
            ADD CONSTRAINT "FK_parent1_family" FOREIGN KEY ("parent1Id") REFERENCES "parent"("id"),
            ADD CONSTRAINT "FK_parent2_family" FOREIGN KEY ("parent2Id") REFERENCES "parent"("id");

            ALTER TABLE "class"
            ADD CONSTRAINT "FK_teacher_class" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "child";
            DROP TABLE "parent";
            DROP TABLE "teacher";
            DROP TABLE "class";
            DROP TABLE "family";
            DROP TABLE "person";
        `);
    }

}