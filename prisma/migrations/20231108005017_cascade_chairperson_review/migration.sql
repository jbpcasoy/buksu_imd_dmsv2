-- DropForeignKey
ALTER TABLE "ChairpersonSuggestion" DROP CONSTRAINT "ChairpersonSuggestion_chairpersonReviewId_fkey";

-- AddForeignKey
ALTER TABLE "ChairpersonSuggestion" ADD CONSTRAINT "ChairpersonSuggestion_chairpersonReviewId_fkey" FOREIGN KEY ("chairpersonReviewId") REFERENCES "ChairpersonReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
