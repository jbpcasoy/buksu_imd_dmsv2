-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "departmentReviewedId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_departmentReviewedId_fkey" FOREIGN KEY ("departmentReviewedId") REFERENCES "DepartmentReviewed"("id") ON DELETE SET NULL ON UPDATE CASCADE;
