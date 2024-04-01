/*
  Warnings:

  - You are about to drop the column `title` on the `Syllabus` table. All the data in the column will be lost.
  - Added the required column `courseCode` to the `Syllabus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseTitle` to the `Syllabus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Syllabus" DROP COLUMN "title",
ADD COLUMN     "courseCode" TEXT NOT NULL,
ADD COLUMN     "courseTitle" TEXT NOT NULL;
