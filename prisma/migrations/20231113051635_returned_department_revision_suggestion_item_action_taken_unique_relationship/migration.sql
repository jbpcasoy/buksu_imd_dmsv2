/*
  Warnings:

  - A unique constraint covering the columns `[returnedDepartmentRevisionSuggestionItemId]` on the table `ReturnedDepartmentRevisionSuggestionItemActionTaken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ReturnedDepartmentRevisionSuggestionItemActionTaken_returne_key" ON "ReturnedDepartmentRevisionSuggestionItemActionTaken"("returnedDepartmentRevisionSuggestionItemId");
