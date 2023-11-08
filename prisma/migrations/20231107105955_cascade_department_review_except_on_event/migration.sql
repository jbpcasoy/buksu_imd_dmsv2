-- DropForeignKey
ALTER TABLE "ChairpersonReview" DROP CONSTRAINT "ChairpersonReview_departmentReviewId_fkey";

-- DropForeignKey
ALTER TABLE "CoordinatorReview" DROP CONSTRAINT "CoordinatorReview_departmentReviewId_fkey";

-- AddForeignKey
ALTER TABLE "ChairpersonReview" ADD CONSTRAINT "ChairpersonReview_departmentReviewId_fkey" FOREIGN KEY ("departmentReviewId") REFERENCES "DepartmentReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorReview" ADD CONSTRAINT "CoordinatorReview_departmentReviewId_fkey" FOREIGN KEY ("departmentReviewId") REFERENCES "DepartmentReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
