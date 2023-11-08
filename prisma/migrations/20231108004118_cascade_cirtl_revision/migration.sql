-- DropForeignKey
ALTER TABLE "IDDCoordinatorEndorsement" DROP CONSTRAINT "IDDCoordinatorEndorsement_cITLRevisionId_fkey";

-- AddForeignKey
ALTER TABLE "IDDCoordinatorEndorsement" ADD CONSTRAINT "IDDCoordinatorEndorsement_cITLRevisionId_fkey" FOREIGN KEY ("cITLRevisionId") REFERENCES "CITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
