/*
  Warnings:

  - A unique constraint covering the columns `[iMFileId]` on the table `QAMISRevision` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iMFileId` to the `QAMISRevision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QAMISRevision" ADD COLUMN     "iMFileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QAMISRevision_iMFileId_key" ON "QAMISRevision"("iMFileId");

-- AddForeignKey
ALTER TABLE "QAMISRevision" ADD CONSTRAINT "QAMISRevision_iMFileId_fkey" FOREIGN KEY ("iMFileId") REFERENCES "IMFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
