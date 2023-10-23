-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'SUBMITTED_CONTENT_SPECIALIST_SUGGESTION_CREATED';
ALTER TYPE "EventType" ADD VALUE 'SUBMITTED_IDD_SPECIALIST_SUGGESTION_CREATED';
ALTER TYPE "EventType" ADD VALUE 'SUBMITTED_CONTENT_EDITOR_SUGGESTION_CREATED';
ALTER TYPE "EventType" ADD VALUE 'IMERC_CITL_REVIEWED_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "iMERCCITLReviewedId" TEXT,
ADD COLUMN     "submittedContentSpecialistSuggestionId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedContentSpecialistSuggestionId_fkey" FOREIGN KEY ("submittedContentSpecialistSuggestionId") REFERENCES "SubmittedContentSpecialistSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMERCCITLReviewedId_fkey" FOREIGN KEY ("iMERCCITLReviewedId") REFERENCES "IMERCCITLReviewed"("id") ON DELETE SET NULL ON UPDATE CASCADE;
