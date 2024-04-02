/*
  Warnings:

  - You are about to drop the column `syllabusId` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[submittedSyllabusChairpersonSuggestionId]` on the table `SyllabusFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submittedReturnedSyllabusDepartmentRevisionId]` on the table `SyllabusFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submittedSyllabusFDISSuggestionId]` on the table `SyllabusFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submittedReturnedSyllabusCITLRevisionId]` on the table `SyllabusFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submittedReturnedSyllabusVPAARevisionId]` on the table `SyllabusFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `submittedReturnedSyllabusCITLRevisionId` to the `SyllabusFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedReturnedSyllabusDepartmentRevisionId` to the `SyllabusFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedReturnedSyllabusVPAARevisionId` to the `SyllabusFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedSyllabusChairpersonSuggestionId` to the `SyllabusFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedSyllabusFDISSuggestionId` to the `SyllabusFile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SyllabusRating" AS ENUM ('YES', 'NO');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_syllabusId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "syllabusId";

-- AlterTable
ALTER TABLE "SyllabusFile" ADD COLUMN     "submittedReturnedSyllabusCITLRevisionId" TEXT NOT NULL,
ADD COLUMN     "submittedReturnedSyllabusDepartmentRevisionId" TEXT NOT NULL,
ADD COLUMN     "submittedReturnedSyllabusVPAARevisionId" TEXT NOT NULL,
ADD COLUMN     "submittedSyllabusChairpersonSuggestionId" TEXT NOT NULL,
ADD COLUMN     "submittedSyllabusFDISSuggestionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SyllabusDepartmentReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "syllabusFileId" TEXT NOT NULL,

    CONSTRAINT "SyllabusDepartmentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusChairpersonReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chairpersonId" TEXT NOT NULL,
    "syllabusDepartmentReviewId" TEXT NOT NULL,
    "q1_1" "SyllabusRating",
    "q1_2" "SyllabusRating",
    "q1_3" "SyllabusRating",
    "q2_1" "SyllabusRating",
    "q2_2" "SyllabusRating",
    "q2_3" "SyllabusRating",
    "q2_4" "SyllabusRating",
    "q2_5" "SyllabusRating",
    "q2_6" "SyllabusRating",
    "q3_1" "SyllabusRating",
    "q3_2" "SyllabusRating",
    "q3_3" "SyllabusRating",
    "q3_4" "SyllabusRating",
    "q3_5" "SyllabusRating",
    "q4_1" "SyllabusRating",
    "q4_2" "SyllabusRating",
    "q4_3" "SyllabusRating",
    "q4_4" "SyllabusRating",
    "q5_1" "SyllabusRating",
    "q5_2" "SyllabusRating",
    "q5_3" "SyllabusRating",
    "q5_4" "SyllabusRating",
    "q5_5" "SyllabusRating",
    "q6_1" "SyllabusRating",
    "q6_2" "SyllabusRating",
    "q6_3" "SyllabusRating",
    "q6_4" "SyllabusRating",
    "q6_5" "SyllabusRating",
    "q6_6" "SyllabusRating",
    "q7_1" "SyllabusRating",
    "q7_2" "SyllabusRating",
    "q7_3" "SyllabusRating",
    "q7_4" "SyllabusRating",
    "q8_1" "SyllabusRating",
    "q8_2" "SyllabusRating",
    "q8_3" "SyllabusRating",
    "q8_4" "SyllabusRating",
    "q8_5" "SyllabusRating",
    "q8_6" "SyllabusRating",

    CONSTRAINT "SyllabusChairpersonReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusChairpersonSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyllabusChairpersonSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusChairpersonSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "syllabusChairpersonSuggestionId" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,

    CONSTRAINT "SyllabusChairpersonSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusChairpersonSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "syllabusChairpersonSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SyllabusChairpersonSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedSyllabusChairpersonSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "syllabusChairpersonSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedSyllabusChairpersonSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusDepartmentRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedSyllabusChairpersonSuggestionId" TEXT NOT NULL,
    "syllabusFileId" TEXT NOT NULL,

    CONSTRAINT "SyllabusDepartmentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedSyllabusDepartmentRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "syllabusDepartmentRevisionId" TEXT NOT NULL,
    "chairpersonId" TEXT NOT NULL,

    CONSTRAINT "ReturnedSyllabusDepartmentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedSyllabusDepartmentRevisionSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "suggestion" TEXT NOT NULL,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,
    "returnedSyllabusDepartmentRevisionId" TEXT NOT NULL,

    CONSTRAINT "ReturnedSyllabusDepartmentRevisionSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedSyllabusDepartmentRevisionSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedSyllabusDepartmentRevisionSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ReturnedSyllabusDepartmentRevisionSuggestionItemActionTake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedReturnedSyllabusDepartmentRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedSyllabusDepartmentRevisionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedReturnedSyllabusDepartmentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusChairpersonEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chairpersonId" TEXT NOT NULL,
    "syllabusDepartmentRevisionId" TEXT NOT NULL,

    CONSTRAINT "SyllabusChairpersonEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusDeanEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deanId" TEXT NOT NULL,
    "syllabusChairpersonEndorsementId" TEXT NOT NULL,

    CONSTRAINT "SyllabusDeanEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FDIS" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FDIS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveFDIS" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fDISId" TEXT NOT NULL,

    CONSTRAINT "ActiveFDIS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusFDISSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "syllabusDeanEndorsementId" TEXT NOT NULL,
    "fDISId" TEXT NOT NULL,

    CONSTRAINT "SyllabusFDISSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusFDISSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "suggestion" TEXT NOT NULL,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,
    "syllabusFDISSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SyllabusFDISSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusFDISSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "syllabusFDISSuggestionItemId" TEXT NOT NULL,

    CONSTRAINT "SyllabusFDISSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedSyllabusFDISSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "syllabusFDISSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedSyllabusFDISSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusCITLRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedSyllabusFDISSuggestionId" TEXT NOT NULL,
    "syllabusFileId" TEXT NOT NULL,

    CONSTRAINT "SyllabusCITLRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedSyllabusCITLRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fDISId" TEXT NOT NULL,
    "syllabusCITLRevisionId" TEXT NOT NULL,

    CONSTRAINT "ReturnedSyllabusCITLRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedSyllabusCITLRevisionSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedSyllabusCITLRevisionId" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,

    CONSTRAINT "ReturnedSyllabusCITLRevisionSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedSyllabusCITLRevisionSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "returnedSyllabusCITLRevisionSuggestionItemId" TEXT NOT NULL,

    CONSTRAINT "ReturnedSyllabusCITLRevisionSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedReturnedSyllabusCITLRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedSyllabusCITLRevisionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedReturnedSyllabusCITLRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusFDISEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fDISId" TEXT NOT NULL,
    "syllabusCITLRevisionId" TEXT NOT NULL,

    CONSTRAINT "SyllabusFDISEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusCITLDirectorEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cITLDirectorId" TEXT NOT NULL,
    "syllabusFDISEndorsementId" TEXT NOT NULL,

    CONSTRAINT "SyllabusCITLDirectorEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VPAA" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VPAA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveVPAA" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vPAAId" TEXT NOT NULL,

    CONSTRAINT "ActiveVPAA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedSyllabusVPAARevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "syllabusCITLDirectorEndorsementId" TEXT NOT NULL,
    "vPAAId" TEXT NOT NULL,

    CONSTRAINT "ReturnedSyllabusVPAARevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedSyllabusVPAARevisionSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "suggestion" TEXT NOT NULL,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,
    "returnedSyllabusVPAARevisionId" TEXT NOT NULL,

    CONSTRAINT "ReturnedSyllabusVPAARevisionSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedSyllabusVPAARevisionSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "returnedSyllabusVPAARevisionSuggestionItemId" TEXT NOT NULL,

    CONSTRAINT "ReturnedSyllabusVPAARevisionSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedReturnedSyllabusVPAARevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedSyllabusVPAARevisionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedReturnedSyllabusVPAARevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyllabusVPAAEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vPAAId" TEXT NOT NULL,
    "syllabusCITLRevisionId" TEXT NOT NULL,

    CONSTRAINT "SyllabusVPAAEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusDepartmentReview_syllabusFileId_key" ON "SyllabusDepartmentReview"("syllabusFileId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusChairpersonReview_syllabusDepartmentReviewId_key" ON "SyllabusChairpersonReview"("syllabusDepartmentReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusChairpersonSuggestionItemActionTaken_syllabusChairp_key" ON "SyllabusChairpersonSuggestionItemActionTaken"("syllabusChairpersonSuggestionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedSyllabusChairpersonSuggestion_syllabusChairpersonS_key" ON "SubmittedSyllabusChairpersonSuggestion"("syllabusChairpersonSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusDepartmentRevision_syllabusFileId_key" ON "SyllabusDepartmentRevision"("syllabusFileId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedSyllabusDepartmentRevision_syllabusDepartmentRevisi_key" ON "ReturnedSyllabusDepartmentRevision"("syllabusDepartmentRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedSyllabusDepartmentRevisionSuggestionItemActionTaken_key" ON "ReturnedSyllabusDepartmentRevisionSuggestionItemActionTaken"("returnedSyllabusDepartmentRevisionSuggestionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedReturnedSyllabusDepartmentRevision_returnedSyllabu_key" ON "SubmittedReturnedSyllabusDepartmentRevision"("returnedSyllabusDepartmentRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusChairpersonEndorsement_syllabusDepartmentRevisionId_key" ON "SyllabusChairpersonEndorsement"("syllabusDepartmentRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusDeanEndorsement_syllabusChairpersonEndorsementId_key" ON "SyllabusDeanEndorsement"("syllabusChairpersonEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "FDIS_userId_key" ON "FDIS"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveFDIS_fDISId_key" ON "ActiveFDIS"("fDISId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusFDISSuggestion_syllabusDeanEndorsementId_key" ON "SyllabusFDISSuggestion"("syllabusDeanEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusFDISSuggestionItemActionTaken_syllabusFDISSuggestio_key" ON "SyllabusFDISSuggestionItemActionTaken"("syllabusFDISSuggestionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedSyllabusFDISSuggestion_syllabusFDISSuggestionId_key" ON "SubmittedSyllabusFDISSuggestion"("syllabusFDISSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusCITLRevision_submittedSyllabusFDISSuggestionId_key" ON "SyllabusCITLRevision"("submittedSyllabusFDISSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusCITLRevision_syllabusFileId_key" ON "SyllabusCITLRevision"("syllabusFileId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedSyllabusCITLRevision_syllabusCITLRevisionId_key" ON "ReturnedSyllabusCITLRevision"("syllabusCITLRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedSyllabusCITLRevisionSuggestionItemActionTaken_retur_key" ON "ReturnedSyllabusCITLRevisionSuggestionItemActionTaken"("returnedSyllabusCITLRevisionSuggestionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedReturnedSyllabusCITLRevision_returnedSyllabusCITLR_key" ON "SubmittedReturnedSyllabusCITLRevision"("returnedSyllabusCITLRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusFDISEndorsement_syllabusCITLRevisionId_key" ON "SyllabusFDISEndorsement"("syllabusCITLRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusCITLDirectorEndorsement_syllabusFDISEndorsementId_key" ON "SyllabusCITLDirectorEndorsement"("syllabusFDISEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "VPAA_userId_key" ON "VPAA"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveVPAA_vPAAId_key" ON "ActiveVPAA"("vPAAId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedSyllabusVPAARevision_syllabusCITLDirectorEndorsemen_key" ON "ReturnedSyllabusVPAARevision"("syllabusCITLDirectorEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedSyllabusVPAARevisionSuggestionItemActionTaken_retur_key" ON "ReturnedSyllabusVPAARevisionSuggestionItemActionTaken"("returnedSyllabusVPAARevisionSuggestionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedReturnedSyllabusVPAARevision_returnedSyllabusVPAAR_key" ON "SubmittedReturnedSyllabusVPAARevision"("returnedSyllabusVPAARevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusVPAAEndorsement_syllabusCITLRevisionId_key" ON "SyllabusVPAAEndorsement"("syllabusCITLRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusFile_submittedSyllabusChairpersonSuggestionId_key" ON "SyllabusFile"("submittedSyllabusChairpersonSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusFile_submittedReturnedSyllabusDepartmentRevisionId_key" ON "SyllabusFile"("submittedReturnedSyllabusDepartmentRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusFile_submittedSyllabusFDISSuggestionId_key" ON "SyllabusFile"("submittedSyllabusFDISSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusFile_submittedReturnedSyllabusCITLRevisionId_key" ON "SyllabusFile"("submittedReturnedSyllabusCITLRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SyllabusFile_submittedReturnedSyllabusVPAARevisionId_key" ON "SyllabusFile"("submittedReturnedSyllabusVPAARevisionId");

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedSyllabusChairpersonSuggestionId_fkey" FOREIGN KEY ("submittedSyllabusChairpersonSuggestionId") REFERENCES "SubmittedSyllabusChairpersonSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedReturnedSyllabusDepartmentRevisionId_fkey" FOREIGN KEY ("submittedReturnedSyllabusDepartmentRevisionId") REFERENCES "SubmittedReturnedSyllabusDepartmentRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedSyllabusFDISSuggestionId_fkey" FOREIGN KEY ("submittedSyllabusFDISSuggestionId") REFERENCES "SubmittedSyllabusFDISSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedReturnedSyllabusCITLRevisionId_fkey" FOREIGN KEY ("submittedReturnedSyllabusCITLRevisionId") REFERENCES "SubmittedReturnedSyllabusCITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFile" ADD CONSTRAINT "SyllabusFile_submittedReturnedSyllabusVPAARevisionId_fkey" FOREIGN KEY ("submittedReturnedSyllabusVPAARevisionId") REFERENCES "SubmittedReturnedSyllabusVPAARevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusDepartmentReview" ADD CONSTRAINT "SyllabusDepartmentReview_syllabusFileId_fkey" FOREIGN KEY ("syllabusFileId") REFERENCES "SyllabusFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusChairpersonReview" ADD CONSTRAINT "SyllabusChairpersonReview_chairpersonId_fkey" FOREIGN KEY ("chairpersonId") REFERENCES "Chairperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusChairpersonReview" ADD CONSTRAINT "SyllabusChairpersonReview_syllabusDepartmentReviewId_fkey" FOREIGN KEY ("syllabusDepartmentReviewId") REFERENCES "SyllabusDepartmentReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusChairpersonSuggestionItem" ADD CONSTRAINT "SyllabusChairpersonSuggestionItem_syllabusChairpersonSugge_fkey" FOREIGN KEY ("syllabusChairpersonSuggestionId") REFERENCES "SyllabusChairpersonSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusChairpersonSuggestionItemActionTaken" ADD CONSTRAINT "SyllabusChairpersonSuggestionItemActionTaken_syllabusChair_fkey" FOREIGN KEY ("syllabusChairpersonSuggestionItemId") REFERENCES "SyllabusChairpersonSuggestionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedSyllabusChairpersonSuggestion" ADD CONSTRAINT "SubmittedSyllabusChairpersonSuggestion_syllabusChairperson_fkey" FOREIGN KEY ("syllabusChairpersonSuggestionId") REFERENCES "SyllabusChairpersonSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusDepartmentRevision" ADD CONSTRAINT "SyllabusDepartmentRevision_submittedSyllabusChairpersonSug_fkey" FOREIGN KEY ("submittedSyllabusChairpersonSuggestionId") REFERENCES "SubmittedSyllabusChairpersonSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusDepartmentRevision" ADD CONSTRAINT "SyllabusDepartmentRevision_syllabusFileId_fkey" FOREIGN KEY ("syllabusFileId") REFERENCES "SyllabusFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusDepartmentRevision" ADD CONSTRAINT "ReturnedSyllabusDepartmentRevision_syllabusDepartmentRevis_fkey" FOREIGN KEY ("syllabusDepartmentRevisionId") REFERENCES "SyllabusDepartmentRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusDepartmentRevision" ADD CONSTRAINT "ReturnedSyllabusDepartmentRevision_chairpersonId_fkey" FOREIGN KEY ("chairpersonId") REFERENCES "Chairperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusDepartmentRevisionSuggestionItem" ADD CONSTRAINT "ReturnedSyllabusDepartmentRevisionSuggestionItem_returnedS_fkey" FOREIGN KEY ("returnedSyllabusDepartmentRevisionId") REFERENCES "ReturnedSyllabusDepartmentRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusDepartmentRevisionSuggestionItemActionTaken" ADD CONSTRAINT "ReturnedSyllabusDepartmentRevisionSuggestionItemActionTake_fkey" FOREIGN KEY ("returnedSyllabusDepartmentRevisionSuggestionItemId") REFERENCES "ReturnedSyllabusDepartmentRevisionSuggestionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedReturnedSyllabusDepartmentRevision" ADD CONSTRAINT "SubmittedReturnedSyllabusDepartmentRevision_returnedSyllab_fkey" FOREIGN KEY ("returnedSyllabusDepartmentRevisionId") REFERENCES "ReturnedSyllabusDepartmentRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusChairpersonEndorsement" ADD CONSTRAINT "SyllabusChairpersonEndorsement_chairpersonId_fkey" FOREIGN KEY ("chairpersonId") REFERENCES "Chairperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusChairpersonEndorsement" ADD CONSTRAINT "SyllabusChairpersonEndorsement_syllabusDepartmentRevisionI_fkey" FOREIGN KEY ("syllabusDepartmentRevisionId") REFERENCES "SyllabusDepartmentRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusDeanEndorsement" ADD CONSTRAINT "SyllabusDeanEndorsement_deanId_fkey" FOREIGN KEY ("deanId") REFERENCES "Dean"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusDeanEndorsement" ADD CONSTRAINT "SyllabusDeanEndorsement_syllabusChairpersonEndorsementId_fkey" FOREIGN KEY ("syllabusChairpersonEndorsementId") REFERENCES "SyllabusChairpersonEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FDIS" ADD CONSTRAINT "FDIS_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveFDIS" ADD CONSTRAINT "ActiveFDIS_fDISId_fkey" FOREIGN KEY ("fDISId") REFERENCES "FDIS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFDISSuggestion" ADD CONSTRAINT "SyllabusFDISSuggestion_syllabusDeanEndorsementId_fkey" FOREIGN KEY ("syllabusDeanEndorsementId") REFERENCES "SyllabusDeanEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFDISSuggestion" ADD CONSTRAINT "SyllabusFDISSuggestion_fDISId_fkey" FOREIGN KEY ("fDISId") REFERENCES "FDIS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFDISSuggestionItem" ADD CONSTRAINT "SyllabusFDISSuggestionItem_syllabusFDISSuggestionId_fkey" FOREIGN KEY ("syllabusFDISSuggestionId") REFERENCES "SyllabusFDISSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFDISSuggestionItemActionTaken" ADD CONSTRAINT "SyllabusFDISSuggestionItemActionTaken_syllabusFDISSuggesti_fkey" FOREIGN KEY ("syllabusFDISSuggestionItemId") REFERENCES "SyllabusFDISSuggestionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedSyllabusFDISSuggestion" ADD CONSTRAINT "SubmittedSyllabusFDISSuggestion_syllabusFDISSuggestionId_fkey" FOREIGN KEY ("syllabusFDISSuggestionId") REFERENCES "SyllabusFDISSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusCITLRevision" ADD CONSTRAINT "SyllabusCITLRevision_submittedSyllabusFDISSuggestionId_fkey" FOREIGN KEY ("submittedSyllabusFDISSuggestionId") REFERENCES "SubmittedSyllabusFDISSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusCITLRevision" ADD CONSTRAINT "SyllabusCITLRevision_syllabusFileId_fkey" FOREIGN KEY ("syllabusFileId") REFERENCES "SyllabusFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusCITLRevision" ADD CONSTRAINT "ReturnedSyllabusCITLRevision_fDISId_fkey" FOREIGN KEY ("fDISId") REFERENCES "FDIS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusCITLRevision" ADD CONSTRAINT "ReturnedSyllabusCITLRevision_syllabusCITLRevisionId_fkey" FOREIGN KEY ("syllabusCITLRevisionId") REFERENCES "SyllabusCITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusCITLRevisionSuggestionItem" ADD CONSTRAINT "ReturnedSyllabusCITLRevisionSuggestionItem_returnedSyllabu_fkey" FOREIGN KEY ("returnedSyllabusCITLRevisionId") REFERENCES "ReturnedSyllabusCITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusCITLRevisionSuggestionItemActionTaken" ADD CONSTRAINT "ReturnedSyllabusCITLRevisionSuggestionItemActionTaken_retu_fkey" FOREIGN KEY ("returnedSyllabusCITLRevisionSuggestionItemId") REFERENCES "ReturnedSyllabusCITLRevisionSuggestionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedReturnedSyllabusCITLRevision" ADD CONSTRAINT "SubmittedReturnedSyllabusCITLRevision_returnedSyllabusCITL_fkey" FOREIGN KEY ("returnedSyllabusCITLRevisionId") REFERENCES "ReturnedSyllabusCITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFDISEndorsement" ADD CONSTRAINT "SyllabusFDISEndorsement_fDISId_fkey" FOREIGN KEY ("fDISId") REFERENCES "FDIS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusFDISEndorsement" ADD CONSTRAINT "SyllabusFDISEndorsement_syllabusCITLRevisionId_fkey" FOREIGN KEY ("syllabusCITLRevisionId") REFERENCES "SyllabusCITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusCITLDirectorEndorsement" ADD CONSTRAINT "SyllabusCITLDirectorEndorsement_cITLDirectorId_fkey" FOREIGN KEY ("cITLDirectorId") REFERENCES "CITLDirector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusCITLDirectorEndorsement" ADD CONSTRAINT "SyllabusCITLDirectorEndorsement_syllabusFDISEndorsementId_fkey" FOREIGN KEY ("syllabusFDISEndorsementId") REFERENCES "SyllabusFDISEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VPAA" ADD CONSTRAINT "VPAA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveVPAA" ADD CONSTRAINT "ActiveVPAA_vPAAId_fkey" FOREIGN KEY ("vPAAId") REFERENCES "VPAA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusVPAARevision" ADD CONSTRAINT "ReturnedSyllabusVPAARevision_syllabusCITLDirectorEndorseme_fkey" FOREIGN KEY ("syllabusCITLDirectorEndorsementId") REFERENCES "SyllabusCITLDirectorEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusVPAARevision" ADD CONSTRAINT "ReturnedSyllabusVPAARevision_vPAAId_fkey" FOREIGN KEY ("vPAAId") REFERENCES "VPAA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusVPAARevisionSuggestionItem" ADD CONSTRAINT "ReturnedSyllabusVPAARevisionSuggestionItem_returnedSyllabu_fkey" FOREIGN KEY ("returnedSyllabusVPAARevisionId") REFERENCES "ReturnedSyllabusVPAARevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedSyllabusVPAARevisionSuggestionItemActionTaken" ADD CONSTRAINT "ReturnedSyllabusVPAARevisionSuggestionItemActionTaken_retu_fkey" FOREIGN KEY ("returnedSyllabusVPAARevisionSuggestionItemId") REFERENCES "ReturnedSyllabusVPAARevisionSuggestionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedReturnedSyllabusVPAARevision" ADD CONSTRAINT "SubmittedReturnedSyllabusVPAARevision_returnedSyllabusVPAA_fkey" FOREIGN KEY ("returnedSyllabusVPAARevisionId") REFERENCES "ReturnedSyllabusVPAARevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusVPAAEndorsement" ADD CONSTRAINT "SyllabusVPAAEndorsement_vPAAId_fkey" FOREIGN KEY ("vPAAId") REFERENCES "VPAA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusVPAAEndorsement" ADD CONSTRAINT "SyllabusVPAAEndorsement_syllabusCITLRevisionId_fkey" FOREIGN KEY ("syllabusCITLRevisionId") REFERENCES "SyllabusCITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
