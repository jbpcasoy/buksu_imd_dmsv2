/*
  Warnings:

  - You are about to drop the column `departmentId` on the `ContentSpecialist` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ContentSpecialist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[facultyId]` on the table `ContentSpecialist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `facultyId` to the `ContentSpecialist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContentSpecialist" DROP CONSTRAINT "ContentSpecialist_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "ContentSpecialist" DROP CONSTRAINT "ContentSpecialist_userId_fkey";

-- DropIndex
DROP INDEX "ContentSpecialist_departmentId_userId_key";

-- AlterTable
ALTER TABLE "ContentSpecialist" DROP COLUMN "departmentId",
DROP COLUMN "userId",
ADD COLUMN     "facultyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ContentSpecialist_facultyId_key" ON "ContentSpecialist"("facultyId");

-- AddForeignKey
ALTER TABLE "ContentSpecialist" ADD CONSTRAINT "ContentSpecialist_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
