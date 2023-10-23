-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'QAMIS_DEPARTMENT_ENDORSEMENT';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "qAMISDepartmentEndorsementId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISDepartmentEndorsementId_fkey" FOREIGN KEY ("qAMISDepartmentEndorsementId") REFERENCES "QAMISDepartmentEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
