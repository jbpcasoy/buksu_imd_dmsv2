/*
  Warnings:

  - Added the required column `iDDCoordinatorId` to the `IDDCoordinatorEndorsement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IDDCoordinatorEndorsement" ADD COLUMN     "iDDCoordinatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "IDDCoordinatorEndorsement" ADD CONSTRAINT "IDDCoordinatorEndorsement_iDDCoordinatorId_fkey" FOREIGN KEY ("iDDCoordinatorId") REFERENCES "IDDCoordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
