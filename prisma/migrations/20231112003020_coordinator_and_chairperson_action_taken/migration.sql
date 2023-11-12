-- CreateTable
CREATE TABLE "ChairpersonSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chairpersonSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ChairpersonSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoordinatorSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coordinatorSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "CoordinatorSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChairpersonSuggestionItemActionTaken_chairpersonSuggestionI_key" ON "ChairpersonSuggestionItemActionTaken"("chairpersonSuggestionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "CoordinatorSuggestionItemActionTaken_coordinatorSuggestionI_key" ON "CoordinatorSuggestionItemActionTaken"("coordinatorSuggestionItemId");

-- AddForeignKey
ALTER TABLE "ChairpersonSuggestionItemActionTaken" ADD CONSTRAINT "ChairpersonSuggestionItemActionTaken_chairpersonSuggestion_fkey" FOREIGN KEY ("chairpersonSuggestionItemId") REFERENCES "ChairpersonSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorSuggestionItemActionTaken" ADD CONSTRAINT "CoordinatorSuggestionItemActionTaken_coordinatorSuggestion_fkey" FOREIGN KEY ("coordinatorSuggestionItemId") REFERENCES "CoordinatorSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
