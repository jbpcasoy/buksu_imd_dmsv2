-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('VM', 'M', 'JE', 'NM', 'NAA');

-- CreateTable
CREATE TABLE "DepartmentReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iMId" TEXT NOT NULL,
    "iMFileId" TEXT NOT NULL,

    CONSTRAINT "DepartmentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeerReview" (
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
    "departmentReviewId" TEXT NOT NULL,

    CONSTRAINT "PeerReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeerSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peerReviewId" TEXT NOT NULL,

    CONSTRAINT "PeerSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeerSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "suggestion" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "peerSuggestionId" TEXT NOT NULL,

    CONSTRAINT "PeerSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedPeerReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peerSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedPeerReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentReview_iMId_key" ON "DepartmentReview"("iMId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentReview_iMFileId_key" ON "DepartmentReview"("iMFileId");

-- CreateIndex
CREATE UNIQUE INDEX "PeerReview_departmentReviewId_key" ON "PeerReview"("departmentReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "PeerSuggestion_peerReviewId_key" ON "PeerSuggestion"("peerReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedPeerReview_peerSuggestionId_key" ON "SubmittedPeerReview"("peerSuggestionId");

-- AddForeignKey
ALTER TABLE "DepartmentReview" ADD CONSTRAINT "DepartmentReview_iMId_fkey" FOREIGN KEY ("iMId") REFERENCES "IM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentReview" ADD CONSTRAINT "DepartmentReview_iMFileId_fkey" FOREIGN KEY ("iMFileId") REFERENCES "IMFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerReview" ADD CONSTRAINT "PeerReview_departmentReviewId_fkey" FOREIGN KEY ("departmentReviewId") REFERENCES "DepartmentReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerSuggestion" ADD CONSTRAINT "PeerSuggestion_peerReviewId_fkey" FOREIGN KEY ("peerReviewId") REFERENCES "PeerReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerSuggestionItem" ADD CONSTRAINT "PeerSuggestionItem_peerSuggestionId_fkey" FOREIGN KEY ("peerSuggestionId") REFERENCES "PeerSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedPeerReview" ADD CONSTRAINT "SubmittedPeerReview_peerSuggestionId_fkey" FOREIGN KEY ("peerSuggestionId") REFERENCES "PeerSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
