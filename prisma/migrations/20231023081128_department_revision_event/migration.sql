-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'DEPARTMENT_REVISION_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "departmentRevisionId" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "url" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_departmentRevisionId_fkey" FOREIGN KEY ("departmentRevisionId") REFERENCES "DepartmentRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
