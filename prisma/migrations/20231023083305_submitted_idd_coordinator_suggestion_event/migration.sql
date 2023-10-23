-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'SUBMITTED_IDD_COORDINATOR_SUGGESTION_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "submittedIDDCoordinatorSuggestionId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedIDDCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedIDDCoordinatorSuggestionId") REFERENCES "SubmittedIDDCoordinatorSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
