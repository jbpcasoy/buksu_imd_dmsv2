/*
  Warnings:

  - You are about to drop the column `contentEditorSuggestionId` on the `IDDSpecialistSuggestionItem` table. All the data in the column will be lost.
  - Added the required column `iDDSpecialistSuggestionId` to the `IDDSpecialistSuggestionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IDDSpecialistSuggestionItem" DROP COLUMN "contentEditorSuggestionId",
ADD COLUMN     "iDDSpecialistSuggestionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "IDDSpecialistSuggestionItem" ADD CONSTRAINT "IDDSpecialistSuggestionItem_iDDSpecialistSuggestionId_fkey" FOREIGN KEY ("iDDSpecialistSuggestionId") REFERENCES "IDDSpecialistSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
