/*
  Warnings:

  - Added the required column `pageNumber` to the `IDDCoordinatorSuggestionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suggestion` to the `IDDCoordinatorSuggestionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IDDCoordinatorSuggestionItem" ADD COLUMN     "actionTaken" TEXT,
ADD COLUMN     "pageNumber" INTEGER NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "suggestion" TEXT NOT NULL;
