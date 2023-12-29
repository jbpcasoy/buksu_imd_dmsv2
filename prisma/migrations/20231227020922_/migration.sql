/*
  Warnings:

  - A unique constraint covering the columns `[submittedIDDCoordinatorSuggestionId]` on the table `IMFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IMFile" ADD COLUMN     "submittedIDDCoordinatorSuggestionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IMFile_submittedIDDCoordinatorSuggestionId_key" ON "IMFile"("submittedIDDCoordinatorSuggestionId");

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedIDDCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedIDDCoordinatorSuggestionId") REFERENCES "SubmittedIDDCoordinatorSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
