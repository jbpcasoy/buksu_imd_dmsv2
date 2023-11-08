-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_cITLDirectorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_cITLRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_coordinatorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_deanEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_departmentReviewId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_departmentReviewedId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_departmentRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_iDDCoordinatorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_iMERCCITLDirectorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_iMERCCITLReviewedId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_iMERCCITLRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_iMERCIDDCoordinatorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_iMId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_qAMISChairpersonEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_qAMISCoordinatorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_qAMISDeanEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_qAMISDepartmentEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_qAMISRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_submittedChairpersonSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_submittedContentEditorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_submittedContentSpecialistSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_submittedCoordinatorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_submittedIDDCoordinatorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_submittedIDDSpecialistSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_submittedPeerSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMId_fkey" FOREIGN KEY ("iMId") REFERENCES "IM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_departmentReviewId_fkey" FOREIGN KEY ("departmentReviewId") REFERENCES "DepartmentReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedPeerSuggestionId_fkey" FOREIGN KEY ("submittedPeerSuggestionId") REFERENCES "SubmittedPeerSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedCoordinatorSuggestionId") REFERENCES "SubmittedCoordinatorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedChairpersonSuggestionId_fkey" FOREIGN KEY ("submittedChairpersonSuggestionId") REFERENCES "SubmittedChairpersonSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_departmentReviewedId_fkey" FOREIGN KEY ("departmentReviewedId") REFERENCES "DepartmentReviewed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_departmentRevisionId_fkey" FOREIGN KEY ("departmentRevisionId") REFERENCES "DepartmentRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_coordinatorEndorsementId_fkey" FOREIGN KEY ("coordinatorEndorsementId") REFERENCES "CoordinatorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_deanEndorsementId_fkey" FOREIGN KEY ("deanEndorsementId") REFERENCES "DeanEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedIDDCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedIDDCoordinatorSuggestionId") REFERENCES "SubmittedIDDCoordinatorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_cITLRevisionId_fkey" FOREIGN KEY ("cITLRevisionId") REFERENCES "CITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iDDCoordinatorEndorsementId_fkey" FOREIGN KEY ("iDDCoordinatorEndorsementId") REFERENCES "IDDCoordinatorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_cITLDirectorEndorsementId_fkey" FOREIGN KEY ("cITLDirectorEndorsementId") REFERENCES "CITLDirectorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISRevisionId_fkey" FOREIGN KEY ("qAMISRevisionId") REFERENCES "QAMISRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISCoordinatorEndorsementId_fkey" FOREIGN KEY ("qAMISCoordinatorEndorsementId") REFERENCES "QAMISCoordinatorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISChairpersonEndorsementId_fkey" FOREIGN KEY ("qAMISChairpersonEndorsementId") REFERENCES "QAMISChairpersonEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISDeanEndorsementId_fkey" FOREIGN KEY ("qAMISDeanEndorsementId") REFERENCES "QAMISDeanEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_qAMISDepartmentEndorsementId_fkey" FOREIGN KEY ("qAMISDepartmentEndorsementId") REFERENCES "QAMISDepartmentEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedContentSpecialistSuggestionId_fkey" FOREIGN KEY ("submittedContentSpecialistSuggestionId") REFERENCES "SubmittedContentSpecialistSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedContentEditorSuggestionId_fkey" FOREIGN KEY ("submittedContentEditorSuggestionId") REFERENCES "SubmittedContentEditorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedIDDSpecialistSuggestionId_fkey" FOREIGN KEY ("submittedIDDSpecialistSuggestionId") REFERENCES "SubmittedIDDSpecialistSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMERCCITLReviewedId_fkey" FOREIGN KEY ("iMERCCITLReviewedId") REFERENCES "IMERCCITLReviewed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMERCCITLRevisionId_fkey" FOREIGN KEY ("iMERCCITLRevisionId") REFERENCES "IMERCCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMERCIDDCoordinatorEndorsementId_fkey" FOREIGN KEY ("iMERCIDDCoordinatorEndorsementId") REFERENCES "IMERCIDDCoordinatorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMERCCITLDirectorEndorsementId_fkey" FOREIGN KEY ("iMERCCITLDirectorEndorsementId") REFERENCES "IMERCCITLDirectorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
