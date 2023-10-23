-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "submittedContentEditorSuggestionId" TEXT,
ADD COLUMN     "submittedIDDSpecialistSuggestionId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedContentEditorSuggestionId_fkey" FOREIGN KEY ("submittedContentEditorSuggestionId") REFERENCES "SubmittedContentEditorSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedIDDSpecialistSuggestionId_fkey" FOREIGN KEY ("submittedIDDSpecialistSuggestionId") REFERENCES "SubmittedIDDSpecialistSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
