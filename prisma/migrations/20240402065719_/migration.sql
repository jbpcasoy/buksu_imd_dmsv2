-- DropForeignKey
ALTER TABLE "SyllabusFile" DROP CONSTRAINT "SyllabusFile_submittedReturnedSyllabusCITLRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "SyllabusFile" DROP CONSTRAINT "SyllabusFile_submittedReturnedSyllabusDepartmentRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "SyllabusFile" DROP CONSTRAINT "SyllabusFile_submittedReturnedSyllabusVPAARevisionId_fkey";

-- DropForeignKey
ALTER TABLE "SyllabusFile" DROP CONSTRAINT "SyllabusFile_submittedSyllabusChairpersonSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "SyllabusFile" DROP CONSTRAINT "SyllabusFile_submittedSyllabusFDISSuggestionId_fkey";

-- AlterTable
ALTER TABLE "SyllabusFile" ALTER COLUMN "submittedReturnedSyllabusCITLRevisionId" DROP NOT NULL,
ALTER COLUMN "submittedReturnedSyllabusDepartmentRevisionId" DROP NOT NULL,
ALTER COLUMN "submittedReturnedSyllabusVPAARevisionId" DROP NOT NULL,
ALTER COLUMN "submittedSyllabusChairpersonSuggestionId" DROP NOT NULL,
ALTER COLUMN "submittedSyllabusFDISSuggestionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedSyllabusChairpersonSuggestionId_fkey" FOREIGN KEY ("submittedSyllabusChairpersonSuggestionId") REFERENCES "SubmittedSyllabusChairpersonSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedReturnedSyllabusDepartmentRevisionId_fkey" FOREIGN KEY ("submittedReturnedSyllabusDepartmentRevisionId") REFERENCES "SubmittedReturnedSyllabusDepartmentRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedSyllabusFDISSuggestionId_fkey" FOREIGN KEY ("submittedSyllabusFDISSuggestionId") REFERENCES "SubmittedSyllabusFDISSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedReturnedSyllabusCITLRevisionId_fkey" FOREIGN KEY ("submittedReturnedSyllabusCITLRevisionId") REFERENCES "SubmittedReturnedSyllabusCITLRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedReturnedSyllabusVPAARevisionId_fkey" FOREIGN KEY ("submittedReturnedSyllabusVPAARevisionId") REFERENCES "SubmittedReturnedSyllabusVPAARevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
