-- DropForeignKey
ALTER TABLE "CITLRevision" DROP CONSTRAINT "CITLRevision_submittedIDDCoordinatorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "ChairpersonSuggestionItem" DROP CONSTRAINT "ChairpersonSuggestionItem_chairpersonSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "ContentEditorReview" DROP CONSTRAINT "ContentEditorReview_qAMISDepartmentEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "ContentEditorSuggestion" DROP CONSTRAINT "ContentEditorSuggestion_contentEditorReviewId_fkey";

-- DropForeignKey
ALTER TABLE "ContentEditorSuggestionItem" DROP CONSTRAINT "ContentEditorSuggestionItem_contentEditorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "ContentSpecialistReview" DROP CONSTRAINT "ContentSpecialistReview_qAMISDepartmentEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "ContentSpecialistSuggestion" DROP CONSTRAINT "ContentSpecialistSuggestion_contentSpecialistReviewId_fkey";

-- DropForeignKey
ALTER TABLE "ContentSpecialistSuggestionItem" DROP CONSTRAINT "ContentSpecialistSuggestionItem_contentSpecialistSuggestio_fkey";

-- DropForeignKey
ALTER TABLE "CoordinatorSuggestionItem" DROP CONSTRAINT "CoordinatorSuggestionItem_coordinatorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentReviewed" DROP CONSTRAINT "DepartmentReviewed_submittedChairpersonSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentReviewed" DROP CONSTRAINT "DepartmentReviewed_submittedCoordinatorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentReviewed" DROP CONSTRAINT "DepartmentReviewed_submittedPeerSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentRevision" DROP CONSTRAINT "DepartmentRevision_departmentReviewedId_fkey";

-- DropForeignKey
ALTER TABLE "IDDCoordinatorSuggestion" DROP CONSTRAINT "IDDCoordinatorSuggestion_deanEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "IDDCoordinatorSuggestionItem" DROP CONSTRAINT "IDDCoordinatorSuggestionItem_iDDCoordinatorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "IDDSpecialistReview" DROP CONSTRAINT "IDDSpecialistReview_qAMISDepartmentEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "IDDSpecialistSuggestion" DROP CONSTRAINT "IDDSpecialistSuggestion_iDDSpecialistReviewId_fkey";

-- DropForeignKey
ALTER TABLE "IDDSpecialistSuggestionItem" DROP CONSTRAINT "IDDSpecialistSuggestionItem_iDDSpecialistSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "IMERCCITLDirectorEndorsement" DROP CONSTRAINT "IMERCCITLDirectorEndorsement_cITLDirectorId_fkey";

-- DropForeignKey
ALTER TABLE "IMERCCITLReviewed" DROP CONSTRAINT "IMERCCITLReviewed_submittedContentEditorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "IMERCCITLReviewed" DROP CONSTRAINT "IMERCCITLReviewed_submittedContentSpecialistSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "IMERCCITLReviewed" DROP CONSTRAINT "IMERCCITLReviewed_submittedIDDSpecialistSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "IMERCCITLRevision" DROP CONSTRAINT "IMERCCITLRevision_iMERCCITLReviewedId_fkey";

-- DropForeignKey
ALTER TABLE "IMERCCITLRevision" DROP CONSTRAINT "IMERCCITLRevision_plagiarismFileId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationRead" DROP CONSTRAINT "NotificationRead_eventId_fkey";

-- DropForeignKey
ALTER TABLE "PeerSuggestionItem" DROP CONSTRAINT "PeerSuggestionItem_peerSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "QAMISFile" DROP CONSTRAINT "QAMISFile_submittedQAMISSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "QAMISRevision" DROP CONSTRAINT "QAMISRevision_qAMISFileId_fkey";

-- DropForeignKey
ALTER TABLE "QAMISRevision" DROP CONSTRAINT "QAMISRevision_submittedQAMISSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "QAMISSuggestion" DROP CONSTRAINT "QAMISSuggestion_cITLDirectorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "QAMISSuggestionItem" DROP CONSTRAINT "QAMISSuggestionItem_qAMISSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedChairpersonSuggestion" DROP CONSTRAINT "SubmittedChairpersonSuggestion_chairpersonSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedContentEditorSuggestion" DROP CONSTRAINT "SubmittedContentEditorSuggestion_contentEditorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedContentSpecialistSuggestion" DROP CONSTRAINT "SubmittedContentSpecialistSuggestion_contentSpecialistSugg_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedCoordinatorSuggestion" DROP CONSTRAINT "SubmittedCoordinatorSuggestion_coordinatorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedIDDCoordinatorSuggestion" DROP CONSTRAINT "SubmittedIDDCoordinatorSuggestion_iDDCoordinatorSuggestion_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedIDDSpecialistSuggestion" DROP CONSTRAINT "SubmittedIDDSpecialistSuggestion_iDDSpecialistSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedPeerSuggestion" DROP CONSTRAINT "SubmittedPeerSuggestion_peerSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "SubmittedQAMISSuggestion" DROP CONSTRAINT "SubmittedQAMISSuggestion_qAMISSuggestionId_fkey";

-- AddForeignKey
ALTER TABLE "PeerSuggestionItem" ADD CONSTRAINT "PeerSuggestionItem_peerSuggestionId_fkey" FOREIGN KEY ("peerSuggestionId") REFERENCES "PeerSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedPeerSuggestion" ADD CONSTRAINT "SubmittedPeerSuggestion_peerSuggestionId_fkey" FOREIGN KEY ("peerSuggestionId") REFERENCES "PeerSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChairpersonSuggestionItem" ADD CONSTRAINT "ChairpersonSuggestionItem_chairpersonSuggestionId_fkey" FOREIGN KEY ("chairpersonSuggestionId") REFERENCES "ChairpersonSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedChairpersonSuggestion" ADD CONSTRAINT "SubmittedChairpersonSuggestion_chairpersonSuggestionId_fkey" FOREIGN KEY ("chairpersonSuggestionId") REFERENCES "ChairpersonSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorSuggestionItem" ADD CONSTRAINT "CoordinatorSuggestionItem_coordinatorSuggestionId_fkey" FOREIGN KEY ("coordinatorSuggestionId") REFERENCES "CoordinatorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedCoordinatorSuggestion" ADD CONSTRAINT "SubmittedCoordinatorSuggestion_coordinatorSuggestionId_fkey" FOREIGN KEY ("coordinatorSuggestionId") REFERENCES "CoordinatorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentReviewed" ADD CONSTRAINT "DepartmentReviewed_submittedCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedCoordinatorSuggestionId") REFERENCES "SubmittedCoordinatorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentReviewed" ADD CONSTRAINT "DepartmentReviewed_submittedChairpersonSuggestionId_fkey" FOREIGN KEY ("submittedChairpersonSuggestionId") REFERENCES "SubmittedChairpersonSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentReviewed" ADD CONSTRAINT "DepartmentReviewed_submittedPeerSuggestionId_fkey" FOREIGN KEY ("submittedPeerSuggestionId") REFERENCES "SubmittedPeerSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentRevision" ADD CONSTRAINT "DepartmentRevision_departmentReviewedId_fkey" FOREIGN KEY ("departmentReviewedId") REFERENCES "DepartmentReviewed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDCoordinatorSuggestion" ADD CONSTRAINT "IDDCoordinatorSuggestion_deanEndorsementId_fkey" FOREIGN KEY ("deanEndorsementId") REFERENCES "DeanEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDCoordinatorSuggestionItem" ADD CONSTRAINT "IDDCoordinatorSuggestionItem_iDDCoordinatorSuggestionId_fkey" FOREIGN KEY ("iDDCoordinatorSuggestionId") REFERENCES "IDDCoordinatorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedIDDCoordinatorSuggestion" ADD CONSTRAINT "SubmittedIDDCoordinatorSuggestion_iDDCoordinatorSuggestion_fkey" FOREIGN KEY ("iDDCoordinatorSuggestionId") REFERENCES "IDDCoordinatorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CITLRevision" ADD CONSTRAINT "CITLRevision_submittedIDDCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedIDDCoordinatorSuggestionId") REFERENCES "SubmittedIDDCoordinatorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISSuggestion" ADD CONSTRAINT "QAMISSuggestion_cITLDirectorEndorsementId_fkey" FOREIGN KEY ("cITLDirectorEndorsementId") REFERENCES "CITLDirectorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISSuggestionItem" ADD CONSTRAINT "QAMISSuggestionItem_qAMISSuggestionId_fkey" FOREIGN KEY ("qAMISSuggestionId") REFERENCES "QAMISSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedQAMISSuggestion" ADD CONSTRAINT "SubmittedQAMISSuggestion_qAMISSuggestionId_fkey" FOREIGN KEY ("qAMISSuggestionId") REFERENCES "QAMISSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISFile" ADD CONSTRAINT "QAMISFile_submittedQAMISSuggestionId_fkey" FOREIGN KEY ("submittedQAMISSuggestionId") REFERENCES "SubmittedQAMISSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISRevision" ADD CONSTRAINT "QAMISRevision_qAMISFileId_fkey" FOREIGN KEY ("qAMISFileId") REFERENCES "QAMISFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISRevision" ADD CONSTRAINT "QAMISRevision_submittedQAMISSuggestionId_fkey" FOREIGN KEY ("submittedQAMISSuggestionId") REFERENCES "SubmittedQAMISSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSpecialistReview" ADD CONSTRAINT "ContentSpecialistReview_qAMISDepartmentEndorsementId_fkey" FOREIGN KEY ("qAMISDepartmentEndorsementId") REFERENCES "QAMISDepartmentEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSpecialistSuggestion" ADD CONSTRAINT "ContentSpecialistSuggestion_contentSpecialistReviewId_fkey" FOREIGN KEY ("contentSpecialistReviewId") REFERENCES "ContentSpecialistReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSpecialistSuggestionItem" ADD CONSTRAINT "ContentSpecialistSuggestionItem_contentSpecialistSuggestio_fkey" FOREIGN KEY ("contentSpecialistSuggestionId") REFERENCES "ContentSpecialistSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedContentSpecialistSuggestion" ADD CONSTRAINT "SubmittedContentSpecialistSuggestion_contentSpecialistSugg_fkey" FOREIGN KEY ("contentSpecialistSuggestionId") REFERENCES "ContentSpecialistSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEditorReview" ADD CONSTRAINT "ContentEditorReview_qAMISDepartmentEndorsementId_fkey" FOREIGN KEY ("qAMISDepartmentEndorsementId") REFERENCES "QAMISDepartmentEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEditorSuggestion" ADD CONSTRAINT "ContentEditorSuggestion_contentEditorReviewId_fkey" FOREIGN KEY ("contentEditorReviewId") REFERENCES "ContentEditorReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEditorSuggestionItem" ADD CONSTRAINT "ContentEditorSuggestionItem_contentEditorSuggestionId_fkey" FOREIGN KEY ("contentEditorSuggestionId") REFERENCES "ContentEditorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedContentEditorSuggestion" ADD CONSTRAINT "SubmittedContentEditorSuggestion_contentEditorSuggestionId_fkey" FOREIGN KEY ("contentEditorSuggestionId") REFERENCES "ContentEditorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDSpecialistReview" ADD CONSTRAINT "IDDSpecialistReview_qAMISDepartmentEndorsementId_fkey" FOREIGN KEY ("qAMISDepartmentEndorsementId") REFERENCES "QAMISDepartmentEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDSpecialistSuggestion" ADD CONSTRAINT "IDDSpecialistSuggestion_iDDSpecialistReviewId_fkey" FOREIGN KEY ("iDDSpecialistReviewId") REFERENCES "IDDSpecialistReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDSpecialistSuggestionItem" ADD CONSTRAINT "IDDSpecialistSuggestionItem_iDDSpecialistSuggestionId_fkey" FOREIGN KEY ("iDDSpecialistSuggestionId") REFERENCES "IDDSpecialistSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedIDDSpecialistSuggestion" ADD CONSTRAINT "SubmittedIDDSpecialistSuggestion_iDDSpecialistSuggestionId_fkey" FOREIGN KEY ("iDDSpecialistSuggestionId") REFERENCES "IDDSpecialistSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLReviewed" ADD CONSTRAINT "IMERCCITLReviewed_submittedIDDSpecialistSuggestionId_fkey" FOREIGN KEY ("submittedIDDSpecialistSuggestionId") REFERENCES "SubmittedIDDSpecialistSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLReviewed" ADD CONSTRAINT "IMERCCITLReviewed_submittedContentEditorSuggestionId_fkey" FOREIGN KEY ("submittedContentEditorSuggestionId") REFERENCES "SubmittedContentEditorSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLReviewed" ADD CONSTRAINT "IMERCCITLReviewed_submittedContentSpecialistSuggestionId_fkey" FOREIGN KEY ("submittedContentSpecialistSuggestionId") REFERENCES "SubmittedContentSpecialistSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLRevision" ADD CONSTRAINT "IMERCCITLRevision_plagiarismFileId_fkey" FOREIGN KEY ("plagiarismFileId") REFERENCES "PlagiarismFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLRevision" ADD CONSTRAINT "IMERCCITLRevision_iMERCCITLReviewedId_fkey" FOREIGN KEY ("iMERCCITLReviewedId") REFERENCES "IMERCCITLReviewed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLDirectorEndorsement" ADD CONSTRAINT "IMERCCITLDirectorEndorsement_cITLDirectorId_fkey" FOREIGN KEY ("cITLDirectorId") REFERENCES "CITLDirector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRead" ADD CONSTRAINT "NotificationRead_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
