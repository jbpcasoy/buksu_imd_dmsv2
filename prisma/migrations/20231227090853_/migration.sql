/*
  Warnings:

  - You are about to drop the column `returnedIMERCCITLRevisionId` on the `IMFile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[submittedReturnedIMERCCITLRevisionId]` on the table `IMFile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "IMFile" DROP CONSTRAINT "IMFile_returnedIMERCCITLRevisionId_fkey";

-- DropIndex
DROP INDEX "IMFile_returnedIMERCCITLRevisionId_key";

-- AlterTable
ALTER TABLE "IMFile" DROP COLUMN "returnedIMERCCITLRevisionId",
ADD COLUMN     "submittedReturnedIMERCCITLRevisionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IMFile_submittedReturnedIMERCCITLRevisionId_key" ON "IMFile"("submittedReturnedIMERCCITLRevisionId");

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedReturnedIMERCCITLRevisionId_fkey" FOREIGN KEY ("submittedReturnedIMERCCITLRevisionId") REFERENCES "SubmittedReturnedIMERCCITLRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
