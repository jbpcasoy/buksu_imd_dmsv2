/*
  Warnings:

  - Added the required column `pageNumber` to the `ChairpersonSuggestionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageNumber` to the `CoordinatorSuggestionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageNumber` to the `PeerSuggestionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChairpersonSuggestionItem" ADD COLUMN     "pageNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CoordinatorSuggestionItem" ADD COLUMN     "pageNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PeerSuggestionItem" ADD COLUMN     "pageNumber" INTEGER NOT NULL;
