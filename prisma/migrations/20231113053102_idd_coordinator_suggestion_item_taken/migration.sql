-- CreateTable
CREATE TABLE "IDDCoordinatorSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iDDCoordinatorSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "IDDCoordinatorSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IDDCoordinatorSuggestionItemActionTaken_iDDCoordinatorSugge_key" ON "IDDCoordinatorSuggestionItemActionTaken"("iDDCoordinatorSuggestionItemId");

-- AddForeignKey
ALTER TABLE "IDDCoordinatorSuggestionItemActionTaken" ADD CONSTRAINT "IDDCoordinatorSuggestionItemActionTaken_iDDCoordinatorSugg_fkey" FOREIGN KEY ("iDDCoordinatorSuggestionItemId") REFERENCES "IDDCoordinatorSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
