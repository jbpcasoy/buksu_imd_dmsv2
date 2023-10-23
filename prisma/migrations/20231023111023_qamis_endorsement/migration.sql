-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'QAMIS_COORDINATOR_ENDORSEMENT';
ALTER TYPE "EventType" ADD VALUE 'QAMIS_CHAIRPERSON_ENDORSEMENT';
ALTER TYPE "EventType" ADD VALUE 'QAMIS_DEAN_ENDORSEMENT';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "qAMISChairpersonEndorsementId" TEXT,
ADD COLUMN     "qAMISCoordinatorEndorsementId" TEXT,
ADD COLUMN     "qAMISDeanEndorsementId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISCoordinatorEndorsementId_fkey" FOREIGN KEY ("qAMISCoordinatorEndorsementId") REFERENCES "QAMISCoordinatorEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISChairpersonEndorsementId_fkey" FOREIGN KEY ("qAMISChairpersonEndorsementId") REFERENCES "QAMISChairpersonEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISDeanEndorsementId_fkey" FOREIGN KEY ("qAMISDeanEndorsementId") REFERENCES "QAMISDeanEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
