-- DropForeignKey
ALTER TABLE "DepartmentReview" DROP CONSTRAINT "DepartmentReview_iMFileId_fkey";

-- AddForeignKey
ALTER TABLE "DepartmentReview" ADD CONSTRAINT "DepartmentReview_iMFileId_fkey" FOREIGN KEY ("iMFileId") REFERENCES "IMFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
