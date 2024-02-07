/*
  Warnings:

  - A unique constraint covering the columns `[submittedQAMISSuggestionId]` on the table `IMFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IMFile" ADD COLUMN     "submittedQAMISSuggestionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IMFile_submittedQAMISSuggestionId_key" ON "IMFile"("submittedQAMISSuggestionId");

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedQAMISSuggestionId_fkey" FOREIGN KEY ("submittedQAMISSuggestionId") REFERENCES "SubmittedQAMISSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
