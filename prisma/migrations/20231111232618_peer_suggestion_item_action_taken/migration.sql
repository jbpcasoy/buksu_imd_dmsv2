-- CreateTable
CREATE TABLE "PeerSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peerSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "PeerSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PeerSuggestionItemActionTaken_peerSuggestionItemId_key" ON "PeerSuggestionItemActionTaken"("peerSuggestionItemId");

-- AddForeignKey
ALTER TABLE "PeerSuggestionItemActionTaken" ADD CONSTRAINT "PeerSuggestionItemActionTaken_peerSuggestionItemId_fkey" FOREIGN KEY ("peerSuggestionItemId") REFERENCES "PeerSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
