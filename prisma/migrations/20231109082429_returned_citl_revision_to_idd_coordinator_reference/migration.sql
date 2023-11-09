/*
  Warnings:

  - You are about to drop the column `coordinatorId` on the `ReturnedCITLRevision` table. All the data in the column will be lost.
  - Added the required column `iDDCoordinatorId` to the `ReturnedCITLRevision` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReturnedCITLRevision" DROP CONSTRAINT "ReturnedCITLRevision_coordinatorId_fkey";

-- AlterTable
ALTER TABLE "ReturnedCITLRevision" DROP COLUMN "coordinatorId",
ADD COLUMN     "iDDCoordinatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ReturnedCITLRevision" ADD CONSTRAINT "ReturnedCITLRevision_iDDCoordinatorId_fkey" FOREIGN KEY ("iDDCoordinatorId") REFERENCES "IDDCoordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
