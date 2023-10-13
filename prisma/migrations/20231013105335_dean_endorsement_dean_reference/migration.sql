/*
  Warnings:

  - Added the required column `deanId` to the `DeanEndorsement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeanEndorsement" ADD COLUMN     "deanId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DeanEndorsement" ADD CONSTRAINT "DeanEndorsement_deanId_fkey" FOREIGN KEY ("deanId") REFERENCES "Dean"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
