-- DropForeignKey
ALTER TABLE "CoordinatorEndorsement" DROP CONSTRAINT "CoordinatorEndorsement_departmentRevisionId_fkey";

-- AddForeignKey
ALTER TABLE "CoordinatorEndorsement" ADD CONSTRAINT "CoordinatorEndorsement_departmentRevisionId_fkey" FOREIGN KEY ("departmentRevisionId") REFERENCES "DepartmentRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
