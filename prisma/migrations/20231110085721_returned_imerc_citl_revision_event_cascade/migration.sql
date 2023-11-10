-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_submittedReturnedIMERCCITLRevisionId_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedReturnedIMERCCITLRevisionId_fkey" FOREIGN KEY ("submittedReturnedIMERCCITLRevisionId") REFERENCES "SubmittedReturnedIMERCCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
