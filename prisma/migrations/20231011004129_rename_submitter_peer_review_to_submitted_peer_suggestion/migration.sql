/*
  Warnings:

  - You are about to drop the `SubmittedPeerReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubmittedPeerReview" DROP CONSTRAINT "SubmittedPeerReview_peerSuggestionId_fkey";

-- DropTable
DROP TABLE "SubmittedPeerReview";

-- CreateTable
CREATE TABLE "SubmittedPeerSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peerSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedPeerSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedPeerSuggestion_peerSuggestionId_key" ON "SubmittedPeerSuggestion"("peerSuggestionId");

-- AddForeignKey
ALTER TABLE "SubmittedPeerSuggestion" ADD CONSTRAINT "SubmittedPeerSuggestion_peerSuggestionId_fkey" FOREIGN KEY ("peerSuggestionId") REFERENCES "PeerSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
