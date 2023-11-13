-- CreateTable
CREATE TABLE "ReturnedCITLRevisionSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedCITLRevisionSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ReturnedCITLRevisionSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedCITLRevisionSuggestionItemActionTaken_returnedCITLR_key" ON "ReturnedCITLRevisionSuggestionItemActionTaken"("returnedCITLRevisionSuggestionItemId");

-- AddForeignKey
ALTER TABLE "ReturnedCITLRevisionSuggestionItemActionTaken" ADD CONSTRAINT "ReturnedCITLRevisionSuggestionItemActionTaken_returnedCITL_fkey" FOREIGN KEY ("returnedCITLRevisionSuggestionItemId") REFERENCES "ReturnedCITLRevisionSuggestionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
