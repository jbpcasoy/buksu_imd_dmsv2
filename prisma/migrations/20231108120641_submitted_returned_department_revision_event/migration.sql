-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "submittedReturnedDepartmentRevisionId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedReturnedDepartmentRevisionId_fkey" FOREIGN KEY ("submittedReturnedDepartmentRevisionId") REFERENCES "SubmittedReturnedDepartmentRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
