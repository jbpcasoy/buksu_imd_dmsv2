/*
  Warnings:

  - You are about to drop the column `facultyId` on the `ContentSpecialistReview` table. All the data in the column will be lost.
  - Added the required column `contentSpecialistId` to the `ContentSpecialistReview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContentSpecialistReview" DROP CONSTRAINT "ContentSpecialistReview_facultyId_fkey";

-- AlterTable
ALTER TABLE "ContentSpecialistReview" DROP COLUMN "facultyId",
ADD COLUMN     "contentSpecialistId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ContentSpecialistReview" ADD CONSTRAINT "ContentSpecialistReview_contentSpecialistId_fkey" FOREIGN KEY ("contentSpecialistId") REFERENCES "ContentSpecialist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
