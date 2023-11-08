-- DropForeignKey
ALTER TABLE "DepartmentRevision" DROP CONSTRAINT "DepartmentRevision_iMFileId_fkey";

-- AddForeignKey
ALTER TABLE "DepartmentRevision" ADD CONSTRAINT "DepartmentRevision_iMFileId_fkey" FOREIGN KEY ("iMFileId") REFERENCES "IMFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
