-- DropForeignKey
ALTER TABLE "DeanEndorsement" DROP CONSTRAINT "DeanEndorsement_coordinatorEndorsementId_fkey";

-- AddForeignKey
ALTER TABLE "DeanEndorsement" ADD CONSTRAINT "DeanEndorsement_coordinatorEndorsementId_fkey" FOREIGN KEY ("coordinatorEndorsementId") REFERENCES "CoordinatorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
