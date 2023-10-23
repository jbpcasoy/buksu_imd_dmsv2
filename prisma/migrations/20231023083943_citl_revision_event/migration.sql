-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'CITL_REVISION';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "cITLRevisionId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_cITLRevisionId_fkey" FOREIGN KEY ("cITLRevisionId") REFERENCES "CITLRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
