-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'SUBMITTED_PEER_SUGGESTION_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "submittedPeerSuggestionId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedPeerSuggestionId_fkey" FOREIGN KEY ("submittedPeerSuggestionId") REFERENCES "SubmittedPeerSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
