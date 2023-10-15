-- DropIndex
DROP INDEX "DepartmentRevision_departmentReviewedId_key";

-- CreateTable
CREATE TABLE "ContentSpecialistReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "q1_1" "Rating",
    "q1_2" "Rating",
    "q2_1" "Rating",
    "q2_2" "Rating",
    "q2_3" "Rating",
    "q2_4" "Rating",
    "q3_1" "Rating",
    "q4_1" "Rating",
    "q4_2" "Rating",
    "q4_3" "Rating",
    "q5_1" "Rating",
    "q5_2" "Rating",
    "q5_3" "Rating",
    "q5_4" "Rating",
    "q6_1" "Rating",
    "q6_2" "Rating",
    "q6_3" "Rating",
    "q6_4" "Rating",
    "q6_5" "Rating",
    "q7_1" "Rating",
    "q7_2" "Rating",
    "q7_3" "Rating",
    "q7_4" "Rating",
    "q7_5" "Rating",
    "q8_1" "Rating",
    "q8_2" "Rating",
    "q8_3" "Rating",
    "facultyId" TEXT NOT NULL,
    "qAMISDepartmentEndorsementId" TEXT NOT NULL,

    CONSTRAINT "ContentSpecialistReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentSpecialistSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentSpecialistReviewId" TEXT NOT NULL,

    CONSTRAINT "ContentSpecialistSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentSpecialistSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentSpecialistSuggestionId" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "actionTaken" TEXT,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,

    CONSTRAINT "ContentSpecialistSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedContentSpecialistSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentSpecialistSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedContentSpecialistSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentEditorReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "q1_1" "Rating",
    "q1_2" "Rating",
    "q2_1" "Rating",
    "q2_2" "Rating",
    "q2_3" "Rating",
    "q2_4" "Rating",
    "q3_1" "Rating",
    "q4_1" "Rating",
    "q4_2" "Rating",
    "q4_3" "Rating",
    "q5_1" "Rating",
    "q5_2" "Rating",
    "q5_3" "Rating",
    "q5_4" "Rating",
    "q6_1" "Rating",
    "q6_2" "Rating",
    "q6_3" "Rating",
    "q6_4" "Rating",
    "q6_5" "Rating",
    "q7_1" "Rating",
    "q7_2" "Rating",
    "q7_3" "Rating",
    "q7_4" "Rating",
    "q7_5" "Rating",
    "q8_1" "Rating",
    "q8_2" "Rating",
    "q8_3" "Rating",
    "cITLDirectorId" TEXT NOT NULL,
    "qAMISDepartmentEndorsementId" TEXT NOT NULL,

    CONSTRAINT "ContentEditorReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentEditorSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentEditorReviewId" TEXT NOT NULL,

    CONSTRAINT "ContentEditorSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentEditorSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentEditorSuggestionId" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "actionTaken" TEXT,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,

    CONSTRAINT "ContentEditorSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedContentEditorSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentEditorSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedContentEditorSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IDDSpecialistReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "q1_1" "Rating",
    "q1_2" "Rating",
    "q2_1" "Rating",
    "q2_2" "Rating",
    "q2_3" "Rating",
    "q2_4" "Rating",
    "q3_1" "Rating",
    "q4_1" "Rating",
    "q4_2" "Rating",
    "q4_3" "Rating",
    "q5_1" "Rating",
    "q5_2" "Rating",
    "q5_3" "Rating",
    "q5_4" "Rating",
    "q6_1" "Rating",
    "q6_2" "Rating",
    "q6_3" "Rating",
    "q6_4" "Rating",
    "q6_5" "Rating",
    "q7_1" "Rating",
    "q7_2" "Rating",
    "q7_3" "Rating",
    "q7_4" "Rating",
    "q7_5" "Rating",
    "q8_1" "Rating",
    "q8_2" "Rating",
    "q8_3" "Rating",
    "iDDCoordinatorId" TEXT NOT NULL,
    "qAMISDepartmentEndorsementId" TEXT NOT NULL,

    CONSTRAINT "IDDSpecialistReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IDDSpecialistSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iDDSpecialistReviewId" TEXT NOT NULL,

    CONSTRAINT "IDDSpecialistSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IDDSpecialistSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentEditorSuggestionId" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "actionTaken" TEXT,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,

    CONSTRAINT "IDDSpecialistSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedIDDSpecialistSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iDDSpecialistSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedIDDSpecialistSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IMERCCITLReviewed" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedIDDSpecialistSuggestionId" TEXT NOT NULL,
    "submittedContentEditorSuggestionId" TEXT NOT NULL,
    "submittedContentSpecialistSuggestionId" TEXT NOT NULL,

    CONSTRAINT "IMERCCITLReviewed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IMERCCITLRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iMERCCITLReviewedId" TEXT NOT NULL,
    "iMFileId" TEXT NOT NULL,
    "returned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "IMERCCITLRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IMERCIDDCoordinatorEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iDDCoordinatorId" TEXT NOT NULL,
    "iMERCCITLRevisionId" TEXT NOT NULL,

    CONSTRAINT "IMERCIDDCoordinatorEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IMERCCITLDirectorEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cITLDirectorId" TEXT NOT NULL,
    "iMERCIDDCoordinatorEndorsementId" TEXT NOT NULL,

    CONSTRAINT "IMERCCITLDirectorEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentSpecialistReview_qAMISDepartmentEndorsementId_key" ON "ContentSpecialistReview"("qAMISDepartmentEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentSpecialistSuggestion_contentSpecialistReviewId_key" ON "ContentSpecialistSuggestion"("contentSpecialistReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedContentSpecialistSuggestion_contentSpecialistSugge_key" ON "SubmittedContentSpecialistSuggestion"("contentSpecialistSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEditorReview_qAMISDepartmentEndorsementId_key" ON "ContentEditorReview"("qAMISDepartmentEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEditorSuggestion_contentEditorReviewId_key" ON "ContentEditorSuggestion"("contentEditorReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedContentEditorSuggestion_contentEditorSuggestionId_key" ON "SubmittedContentEditorSuggestion"("contentEditorSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "IDDSpecialistReview_qAMISDepartmentEndorsementId_key" ON "IDDSpecialistReview"("qAMISDepartmentEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "IDDSpecialistSuggestion_iDDSpecialistReviewId_key" ON "IDDSpecialistSuggestion"("iDDSpecialistReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedIDDSpecialistSuggestion_iDDSpecialistSuggestionId_key" ON "SubmittedIDDSpecialistSuggestion"("iDDSpecialistSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "IMERCCITLReviewed_submittedIDDSpecialistSuggestionId_key" ON "IMERCCITLReviewed"("submittedIDDSpecialistSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "IMERCCITLReviewed_submittedContentEditorSuggestionId_key" ON "IMERCCITLReviewed"("submittedContentEditorSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "IMERCCITLReviewed_submittedContentSpecialistSuggestionId_key" ON "IMERCCITLReviewed"("submittedContentSpecialistSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "IMERCCITLRevision_iMFileId_key" ON "IMERCCITLRevision"("iMFileId");

-- CreateIndex
CREATE UNIQUE INDEX "IMERCIDDCoordinatorEndorsement_iMERCCITLRevisionId_key" ON "IMERCIDDCoordinatorEndorsement"("iMERCCITLRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "IMERCCITLDirectorEndorsement_iMERCIDDCoordinatorEndorsement_key" ON "IMERCCITLDirectorEndorsement"("iMERCIDDCoordinatorEndorsementId");

-- AddForeignKey
ALTER TABLE "ContentSpecialistReview" ADD CONSTRAINT "ContentSpecialistReview_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSpecialistReview" ADD CONSTRAINT "ContentSpecialistReview_qAMISDepartmentEndorsementId_fkey" FOREIGN KEY ("qAMISDepartmentEndorsementId") REFERENCES "QAMISDepartmentEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSpecialistSuggestion" ADD CONSTRAINT "ContentSpecialistSuggestion_contentSpecialistReviewId_fkey" FOREIGN KEY ("contentSpecialistReviewId") REFERENCES "ContentSpecialistReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSpecialistSuggestionItem" ADD CONSTRAINT "ContentSpecialistSuggestionItem_contentSpecialistSuggestio_fkey" FOREIGN KEY ("contentSpecialistSuggestionId") REFERENCES "ContentSpecialistSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedContentSpecialistSuggestion" ADD CONSTRAINT "SubmittedContentSpecialistSuggestion_contentSpecialistSugg_fkey" FOREIGN KEY ("contentSpecialistSuggestionId") REFERENCES "ContentSpecialistSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEditorReview" ADD CONSTRAINT "ContentEditorReview_cITLDirectorId_fkey" FOREIGN KEY ("cITLDirectorId") REFERENCES "CITLDirector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEditorReview" ADD CONSTRAINT "ContentEditorReview_qAMISDepartmentEndorsementId_fkey" FOREIGN KEY ("qAMISDepartmentEndorsementId") REFERENCES "QAMISDepartmentEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEditorSuggestion" ADD CONSTRAINT "ContentEditorSuggestion_contentEditorReviewId_fkey" FOREIGN KEY ("contentEditorReviewId") REFERENCES "ContentEditorReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEditorSuggestionItem" ADD CONSTRAINT "ContentEditorSuggestionItem_contentEditorSuggestionId_fkey" FOREIGN KEY ("contentEditorSuggestionId") REFERENCES "ContentEditorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedContentEditorSuggestion" ADD CONSTRAINT "SubmittedContentEditorSuggestion_contentEditorSuggestionId_fkey" FOREIGN KEY ("contentEditorSuggestionId") REFERENCES "ContentEditorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDSpecialistReview" ADD CONSTRAINT "IDDSpecialistReview_iDDCoordinatorId_fkey" FOREIGN KEY ("iDDCoordinatorId") REFERENCES "IDDCoordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDSpecialistReview" ADD CONSTRAINT "IDDSpecialistReview_qAMISDepartmentEndorsementId_fkey" FOREIGN KEY ("qAMISDepartmentEndorsementId") REFERENCES "QAMISDepartmentEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDSpecialistSuggestion" ADD CONSTRAINT "IDDSpecialistSuggestion_iDDSpecialistReviewId_fkey" FOREIGN KEY ("iDDSpecialistReviewId") REFERENCES "IDDSpecialistReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedIDDSpecialistSuggestion" ADD CONSTRAINT "SubmittedIDDSpecialistSuggestion_iDDSpecialistSuggestionId_fkey" FOREIGN KEY ("iDDSpecialistSuggestionId") REFERENCES "IDDSpecialistSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLReviewed" ADD CONSTRAINT "IMERCCITLReviewed_submittedIDDSpecialistSuggestionId_fkey" FOREIGN KEY ("submittedIDDSpecialistSuggestionId") REFERENCES "SubmittedIDDSpecialistSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLReviewed" ADD CONSTRAINT "IMERCCITLReviewed_submittedContentEditorSuggestionId_fkey" FOREIGN KEY ("submittedContentEditorSuggestionId") REFERENCES "SubmittedContentEditorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLReviewed" ADD CONSTRAINT "IMERCCITLReviewed_submittedContentSpecialistSuggestionId_fkey" FOREIGN KEY ("submittedContentSpecialistSuggestionId") REFERENCES "SubmittedContentSpecialistSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLRevision" ADD CONSTRAINT "IMERCCITLRevision_iMERCCITLReviewedId_fkey" FOREIGN KEY ("iMERCCITLReviewedId") REFERENCES "IMERCCITLReviewed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLRevision" ADD CONSTRAINT "IMERCCITLRevision_iMFileId_fkey" FOREIGN KEY ("iMFileId") REFERENCES "IMFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCIDDCoordinatorEndorsement" ADD CONSTRAINT "IMERCIDDCoordinatorEndorsement_iDDCoordinatorId_fkey" FOREIGN KEY ("iDDCoordinatorId") REFERENCES "IDDCoordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCIDDCoordinatorEndorsement" ADD CONSTRAINT "IMERCIDDCoordinatorEndorsement_iMERCCITLRevisionId_fkey" FOREIGN KEY ("iMERCCITLRevisionId") REFERENCES "IMERCCITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLDirectorEndorsement" ADD CONSTRAINT "IMERCCITLDirectorEndorsement_cITLDirectorId_fkey" FOREIGN KEY ("cITLDirectorId") REFERENCES "CITLDirector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLDirectorEndorsement" ADD CONSTRAINT "IMERCCITLDirectorEndorsement_iMERCIDDCoordinatorEndorsemen_fkey" FOREIGN KEY ("iMERCIDDCoordinatorEndorsementId") REFERENCES "IMERCIDDCoordinatorEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
