/*
  Warnings:

  - Added the required column `coordinatorId` to the `CoordinatorEndorsement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoordinatorEndorsement" ADD COLUMN     "coordinatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CoordinatorEndorsement" ADD CONSTRAINT "CoordinatorEndorsement_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
