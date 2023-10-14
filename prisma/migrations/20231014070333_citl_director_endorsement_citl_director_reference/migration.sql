/*
  Warnings:

  - Added the required column `cITLDirectorId` to the `CITLDirectorEndorsement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CITLDirectorEndorsement" ADD COLUMN     "cITLDirectorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CITLDirectorEndorsement" ADD CONSTRAINT "CITLDirectorEndorsement_cITLDirectorId_fkey" FOREIGN KEY ("cITLDirectorId") REFERENCES "CITLDirector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
