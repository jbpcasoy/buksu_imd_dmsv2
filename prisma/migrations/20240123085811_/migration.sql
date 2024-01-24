-- DropForeignKey
ALTER TABLE "IMFile" DROP CONSTRAINT "IMFile_departmentReviewedId_fkey";

-- DropForeignKey
ALTER TABLE "IMFile" DROP CONSTRAINT "IMFile_iMERCCITLReviewedId_fkey";

-- DropForeignKey
ALTER TABLE "IMFile" DROP CONSTRAINT "IMFile_submittedIDDCoordinatorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "IMFile" DROP CONSTRAINT "IMFile_submittedQAMISSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "IMFile" DROP CONSTRAINT "IMFile_submittedReturnedCITLRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "IMFile" DROP CONSTRAINT "IMFile_submittedReturnedDepartmentRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "IMFile" DROP CONSTRAINT "IMFile_submittedReturnedIMERCCITLRevisionId_fkey";

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_departmentReviewedId_fkey" FOREIGN KEY ("departmentReviewedId") REFERENCES "DepartmentReviewed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedReturnedDepartmentRevisionId_fkey" FOREIGN KEY ("submittedReturnedDepartmentRevisionId") REFERENCES "SubmittedReturnedDepartmentRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedIDDCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedIDDCoordinatorSuggestionId") REFERENCES "SubmittedIDDCoordinatorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedReturnedCITLRevisionId_fkey" FOREIGN KEY ("submittedReturnedCITLRevisionId") REFERENCES "SubmittedReturnedCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedQAMISSuggestionId_fkey" FOREIGN KEY ("submittedQAMISSuggestionId") REFERENCES "SubmittedQAMISSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_iMERCCITLReviewedId_fkey" FOREIGN KEY ("iMERCCITLReviewedId") REFERENCES "IMERCCITLReviewed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedReturnedIMERCCITLRevisionId_fkey" FOREIGN KEY ("submittedReturnedIMERCCITLRevisionId") REFERENCES "SubmittedReturnedIMERCCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
