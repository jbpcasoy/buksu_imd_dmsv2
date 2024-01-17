/*
  Warnings:

  - You are about to drop the column `actionTaken` on the `ChairpersonSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionTaken` on the `ContentEditorSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionTaken` on the `ContentSpecialistSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionTaken` on the `CoordinatorSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionTaken` on the `IDDCoordinatorSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionTaken` on the `IDDSpecialistSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionTaken` on the `PeerSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionTaken` on the `ReturnedCITLRevisionSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionTaken` on the `ReturnedDepartmentRevisionSuggestionItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionTaken` on the `ReturnedIMERCCITLRevisionSuggestionItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChairpersonSuggestionItem" DROP COLUMN "actionTaken";

-- AlterTable
ALTER TABLE "ContentEditorSuggestionItem" DROP COLUMN "actionTaken";

-- AlterTable
ALTER TABLE "ContentSpecialistSuggestionItem" DROP COLUMN "actionTaken";

-- AlterTable
ALTER TABLE "CoordinatorSuggestionItem" DROP COLUMN "actionTaken";

-- AlterTable
ALTER TABLE "IDDCoordinatorSuggestionItem" DROP COLUMN "actionTaken";

-- AlterTable
ALTER TABLE "IDDSpecialistSuggestionItem" DROP COLUMN "actionTaken";

-- AlterTable
ALTER TABLE "PeerSuggestionItem" DROP COLUMN "actionTaken";

-- AlterTable
ALTER TABLE "ReturnedCITLRevisionSuggestionItem" DROP COLUMN "actionTaken";

-- AlterTable
ALTER TABLE "ReturnedDepartmentRevisionSuggestionItem" DROP COLUMN "actionTaken";

-- AlterTable
ALTER TABLE "ReturnedIMERCCITLRevisionSuggestionItem" DROP COLUMN "actionTaken";
