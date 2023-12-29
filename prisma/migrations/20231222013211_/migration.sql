/*
  Warnings:

  - A unique constraint covering the columns `[submittedQAMISSuggestionId]` on the table `QAMISFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QAMISFile_submittedQAMISSuggestionId_key" ON "QAMISFile"("submittedQAMISSuggestionId");
