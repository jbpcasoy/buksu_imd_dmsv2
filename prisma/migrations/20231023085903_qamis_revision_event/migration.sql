-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'QAMIS_REVISION_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "qAMISRevisionId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISRevisionId_fkey" FOREIGN KEY ("qAMISRevisionId") REFERENCES "QAMISRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
