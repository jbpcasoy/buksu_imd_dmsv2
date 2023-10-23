-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'DEPARTMENT_REVIEW_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "departmentReviewId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_departmentReviewId_fkey" FOREIGN KEY ("departmentReviewId") REFERENCES "DepartmentReview"("id") ON DELETE SET NULL ON UPDATE CASCADE;
