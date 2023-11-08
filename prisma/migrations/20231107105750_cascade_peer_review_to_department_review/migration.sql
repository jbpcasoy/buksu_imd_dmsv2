-- DropForeignKey
ALTER TABLE "PeerReview" DROP CONSTRAINT "PeerReview_departmentReviewId_fkey";

-- AddForeignKey
ALTER TABLE "PeerReview" ADD CONSTRAINT "PeerReview_departmentReviewId_fkey" FOREIGN KEY ("departmentReviewId") REFERENCES "DepartmentReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
