/*
  Warnings:

  - A unique constraint covering the columns `[returnedIMERCCITLRevisionId]` on the table `IMFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IMFile" ADD COLUMN     "returnedIMERCCITLRevisionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IMFile_returnedIMERCCITLRevisionId_key" ON "IMFile"("returnedIMERCCITLRevisionId");

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_returnedIMERCCITLRevisionId_fkey" FOREIGN KEY ("returnedIMERCCITLRevisionId") REFERENCES "ReturnedIMERCCITLRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
