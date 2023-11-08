-- DropForeignKey
ALTER TABLE "PeerSuggestion" DROP CONSTRAINT "PeerSuggestion_peerReviewId_fkey";

-- AddForeignKey
ALTER TABLE "PeerSuggestion" ADD CONSTRAINT "PeerSuggestion_peerReviewId_fkey" FOREIGN KEY ("peerReviewId") REFERENCES "PeerReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
