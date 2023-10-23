-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'SUBMITTED_CHAIRPERSON_SUGGESTION_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "submittedChairpersonSuggestionId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedChairpersonSuggestionId_fkey" FOREIGN KEY ("submittedChairpersonSuggestionId") REFERENCES "SubmittedChairpersonSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
