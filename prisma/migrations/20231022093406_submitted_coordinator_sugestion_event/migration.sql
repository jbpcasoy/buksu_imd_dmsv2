-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'SUBMITTED_COORDINATOR_SUGGESTION_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "submittedCoordinatorSuggestionId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedCoordinatorSuggestionId") REFERENCES "SubmittedCoordinatorSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
