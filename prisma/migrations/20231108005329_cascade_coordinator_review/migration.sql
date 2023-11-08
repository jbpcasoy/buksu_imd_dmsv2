-- DropForeignKey
ALTER TABLE "CoordinatorSuggestion" DROP CONSTRAINT "CoordinatorSuggestion_coordinatorReviewId_fkey";

-- AddForeignKey
ALTER TABLE "CoordinatorSuggestion" ADD CONSTRAINT "CoordinatorSuggestion_coordinatorReviewId_fkey" FOREIGN KEY ("coordinatorReviewId") REFERENCES "CoordinatorReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
