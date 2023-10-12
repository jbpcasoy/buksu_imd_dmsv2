/*
  Warnings:

  - Added the required column `chairpersonId` to the `ChairpersonReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordinatorId` to the `CoordinatorReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facultyId` to the `PeerReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChairpersonReview" ADD COLUMN     "chairpersonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CoordinatorReview" ADD COLUMN     "coordinatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PeerReview" ADD COLUMN     "facultyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PeerReview" ADD CONSTRAINT "PeerReview_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChairpersonReview" ADD CONSTRAINT "ChairpersonReview_chairpersonId_fkey" FOREIGN KEY ("chairpersonId") REFERENCES "Chairperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorReview" ADD CONSTRAINT "CoordinatorReview_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
