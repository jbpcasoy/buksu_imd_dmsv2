-- CreateTable
CREATE TABLE "ReturnedIMERCCITLRevisionSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedIMERCCITLRevisionSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ReturnedIMERCCITLRevisionSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedIMERCCITLRevisionSuggestionItemActionTaken_returned_key" ON "ReturnedIMERCCITLRevisionSuggestionItemActionTaken"("returnedIMERCCITLRevisionSuggestionItemId");

-- AddForeignKey
ALTER TABLE "ReturnedIMERCCITLRevisionSuggestionItemActionTaken" ADD CONSTRAINT "ReturnedIMERCCITLRevisionSuggestionItemActionTaken_returne_fkey" FOREIGN KEY ("returnedIMERCCITLRevisionSuggestionItemId") REFERENCES "ReturnedIMERCCITLRevisionSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
