-- DropForeignKey
ALTER TABLE "SubmittedReturnedCITLRevision" DROP CONSTRAINT "SubmittedReturnedCITLRevision_returnedCITLRevisionId_fkey";

-- AddForeignKey
ALTER TABLE "SubmittedReturnedCITLRevision" ADD CONSTRAINT "SubmittedReturnedCITLRevision_returnedCITLRevisionId_fkey" FOREIGN KEY ("returnedCITLRevisionId") REFERENCES "ReturnedCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
