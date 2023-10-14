/*
  Warnings:

  - You are about to drop the column `qAMISSuggestionId` on the `QAMISFile` table. All the data in the column will be lost.
  - Added the required column `submittedQAMISSuggestionId` to the `QAMISFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QAMISFile" DROP CONSTRAINT "QAMISFile_qAMISSuggestionId_fkey";

-- AlterTable
ALTER TABLE "QAMISFile" DROP COLUMN "qAMISSuggestionId",
ADD COLUMN     "submittedQAMISSuggestionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QAMISFile" ADD CONSTRAINT "QAMISFile_submittedQAMISSuggestionId_fkey" FOREIGN KEY ("submittedQAMISSuggestionId") REFERENCES "SubmittedQAMISSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
