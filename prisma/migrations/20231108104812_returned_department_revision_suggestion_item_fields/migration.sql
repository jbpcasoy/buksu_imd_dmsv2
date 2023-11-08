/*
  Warnings:

  - Added the required column `pageNumber` to the `ReturnedDepartmentRevisionSuggestionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suggestion` to the `ReturnedDepartmentRevisionSuggestionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReturnedDepartmentRevisionSuggestionItem" ADD COLUMN     "actionTaken" TEXT,
ADD COLUMN     "pageNumber" INTEGER NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "suggestion" TEXT NOT NULL;
