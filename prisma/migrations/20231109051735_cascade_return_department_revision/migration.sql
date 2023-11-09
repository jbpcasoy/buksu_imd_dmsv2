-- DropForeignKey
ALTER TABLE "ReturnedDepartmentRevisionSuggestionItem" DROP CONSTRAINT "ReturnedDepartmentRevisionSuggestionItem_returnedDepartmen_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedReturnedDepartmentRevision" DROP CONSTRAINT "SubmittedReturnedDepartmentRevision_returnedDepartmentRevi_fkey";

-- AddForeignKey
ALTER TABLE "ReturnedDepartmentRevisionSuggestionItem" ADD CONSTRAINT "ReturnedDepartmentRevisionSuggestionItem_returnedDepartmen_fkey" FOREIGN KEY ("returnedDepartmentRevisionId") REFERENCES "ReturnedDepartmentRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedReturnedDepartmentRevision" ADD CONSTRAINT "SubmittedReturnedDepartmentRevision_returnedDepartmentRevi_fkey" FOREIGN KEY ("returnedDepartmentRevisionId") REFERENCES "ReturnedDepartmentRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
