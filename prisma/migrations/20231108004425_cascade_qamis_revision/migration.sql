-- DropForeignKey
ALTER TABLE "QAMISChairpersonEndorsement" DROP CONSTRAINT "QAMISChairpersonEndorsement_qAMISRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "QAMISCoordinatorEndorsement" DROP CONSTRAINT "QAMISCoordinatorEndorsement_qAMISRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "QAMISDeanEndorsement" DROP CONSTRAINT "QAMISDeanEndorsement_qAMISRevisionId_fkey";

-- AddForeignKey
ALTER TABLE "QAMISCoordinatorEndorsement" ADD CONSTRAINT "QAMISCoordinatorEndorsement_qAMISRevisionId_fkey" FOREIGN KEY ("qAMISRevisionId") REFERENCES "QAMISRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISChairpersonEndorsement" ADD CONSTRAINT "QAMISChairpersonEndorsement_qAMISRevisionId_fkey" FOREIGN KEY ("qAMISRevisionId") REFERENCES "QAMISRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISDeanEndorsement" ADD CONSTRAINT "QAMISDeanEndorsement_qAMISRevisionId_fkey" FOREIGN KEY ("qAMISRevisionId") REFERENCES "QAMISRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
