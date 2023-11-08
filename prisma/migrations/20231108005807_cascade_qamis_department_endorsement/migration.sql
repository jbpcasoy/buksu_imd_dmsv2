-- DropForeignKey
ALTER TABLE "QAMISDepartmentEndorsement" DROP CONSTRAINT "QAMISDepartmentEndorsement_qAMISChairpersonEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "QAMISDepartmentEndorsement" DROP CONSTRAINT "QAMISDepartmentEndorsement_qAMISCoordinatorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "QAMISDepartmentEndorsement" DROP CONSTRAINT "QAMISDepartmentEndorsement_qAMISDeanEndorsementId_fkey";

-- AddForeignKey
ALTER TABLE "QAMISDepartmentEndorsement" ADD CONSTRAINT "QAMISDepartmentEndorsement_qAMISDeanEndorsementId_fkey" FOREIGN KEY ("qAMISDeanEndorsementId") REFERENCES "QAMISDeanEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISDepartmentEndorsement" ADD CONSTRAINT "QAMISDepartmentEndorsement_qAMISChairpersonEndorsementId_fkey" FOREIGN KEY ("qAMISChairpersonEndorsementId") REFERENCES "QAMISChairpersonEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISDepartmentEndorsement" ADD CONSTRAINT "QAMISDepartmentEndorsement_qAMISCoordinatorEndorsementId_fkey" FOREIGN KEY ("qAMISCoordinatorEndorsementId") REFERENCES "QAMISCoordinatorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
