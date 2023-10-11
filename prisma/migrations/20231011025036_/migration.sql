/*
  Warnings:

  - You are about to drop the column `ChairpersonReviewId` on the `ChairpersonSuggestion` table. All the data in the column will be lost.
  - You are about to drop the column `ChairpersonSuggestionId` on the `ChairpersonSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `ChairpersonSuggestionId` on the `SubmittedChairpersonSuggestion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chairpersonReviewId]` on the table `ChairpersonSuggestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chairpersonSuggestionId]` on the table `SubmittedChairpersonSuggestion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chairpersonReviewId` to the `ChairpersonSuggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chairpersonSuggestionId` to the `ChairpersonSuggestionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chairpersonSuggestionId` to the `SubmittedChairpersonSuggestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChairpersonSuggestion" DROP CONSTRAINT "ChairpersonSuggestion_ChairpersonReviewId_fkey";

-- DropForeignKey
ALTER TABLE "ChairpersonSuggestionItem" DROP CONSTRAINT "ChairpersonSuggestionItem_ChairpersonSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedChairpersonSuggestion" DROP CONSTRAINT "SubmittedChairpersonSuggestion_ChairpersonSuggestionId_fkey";

-- DropIndex
DROP INDEX "ChairpersonSuggestion_ChairpersonReviewId_key";

-- DropIndex
DROP INDEX "SubmittedChairpersonSuggestion_ChairpersonSuggestionId_key";

-- AlterTable
ALTER TABLE "ChairpersonSuggestion" DROP COLUMN "ChairpersonReviewId",
ADD COLUMN     "chairpersonReviewId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChairpersonSuggestionItem" DROP COLUMN "ChairpersonSuggestionId",
ADD COLUMN     "chairpersonSuggestionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubmittedChairpersonSuggestion" DROP COLUMN "ChairpersonSuggestionId",
ADD COLUMN     "chairpersonSuggestionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChairpersonSuggestion_chairpersonReviewId_key" ON "ChairpersonSuggestion"("chairpersonReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedChairpersonSuggestion_chairpersonSuggestionId_key" ON "SubmittedChairpersonSuggestion"("chairpersonSuggestionId");

-- AddForeignKey
ALTER TABLE "ChairpersonSuggestion" ADD CONSTRAINT "ChairpersonSuggestion_chairpersonReviewId_fkey" FOREIGN KEY ("chairpersonReviewId") REFERENCES "ChairpersonReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChairpersonSuggestionItem" ADD CONSTRAINT "ChairpersonSuggestionItem_chairpersonSuggestionId_fkey" FOREIGN KEY ("chairpersonSuggestionId") REFERENCES "ChairpersonSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedChairpersonSuggestion" ADD CONSTRAINT "SubmittedChairpersonSuggestion_chairpersonSuggestionId_fkey" FOREIGN KEY ("chairpersonSuggestionId") REFERENCES "ChairpersonSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
