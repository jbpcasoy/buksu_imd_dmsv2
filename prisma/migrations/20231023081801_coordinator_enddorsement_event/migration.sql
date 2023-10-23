-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "coordinatorEndorsementId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_coordinatorEndorsementId_fkey" FOREIGN KEY ("coordinatorEndorsementId") REFERENCES "CoordinatorEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
