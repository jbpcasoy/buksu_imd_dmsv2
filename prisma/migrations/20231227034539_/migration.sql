/*
  Warnings:

  - A unique constraint covering the columns `[submittedReturnedCITLRevisionId]` on the table `IMFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IMFile" ADD COLUMN     "submittedReturnedCITLRevisionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IMFile_submittedReturnedCITLRevisionId_key" ON "IMFile"("submittedReturnedCITLRevisionId");

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedReturnedCITLRevisionId_fkey" FOREIGN KEY ("submittedReturnedCITLRevisionId") REFERENCES "SubmittedReturnedCITLRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
