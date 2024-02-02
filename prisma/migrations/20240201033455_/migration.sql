/*
  Warnings:

  - Added the required column `facultyId` to the `CoAuthor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoAuthor" ADD COLUMN     "facultyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CoAuthor" ADD CONSTRAINT "CoAuthor_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
