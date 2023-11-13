-- DropForeignKey
ALTER TABLE "ReturnedCITLRevisionSuggestionItemActionTaken" DROP CONSTRAINT "ReturnedCITLRevisionSuggestionItemActionTaken_returnedCITL_fkey";

-- CreateTable
CREATE TABLE "ContentSpecialistSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentSpecialistSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ContentSpecialistSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentEditorSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentEditorSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ContentEditorSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IDDSpecialistSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iDDSpecialistSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "IDDSpecialistSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentSpecialistSuggestionItemActionTaken_contentSpecialis_key" ON "ContentSpecialistSuggestionItemActionTaken"("contentSpecialistSuggestionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEditorSuggestionItemActionTaken_contentEditorSuggest_key" ON "ContentEditorSuggestionItemActionTaken"("contentEditorSuggestionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "IDDSpecialistSuggestionItemActionTaken_iDDSpecialistSuggest_key" ON "IDDSpecialistSuggestionItemActionTaken"("iDDSpecialistSuggestionItemId");

-- AddForeignKey
ALTER TABLE "ReturnedCITLRevisionSuggestionItemActionTaken" ADD CONSTRAINT "ReturnedCITLRevisionSuggestionItemActionTaken_returnedCITL_fkey" FOREIGN KEY ("returnedCITLRevisionSuggestionItemId") REFERENCES "ReturnedCITLRevisionSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSpecialistSuggestionItemActionTaken" ADD CONSTRAINT "ContentSpecialistSuggestionItemActionTaken_contentSpeciali_fkey" FOREIGN KEY ("contentSpecialistSuggestionItemId") REFERENCES "ContentSpecialistSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEditorSuggestionItemActionTaken" ADD CONSTRAINT "ContentEditorSuggestionItemActionTaken_contentEditorSugges_fkey" FOREIGN KEY ("contentEditorSuggestionItemId") REFERENCES "ContentEditorSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDSpecialistSuggestionItemActionTaken" ADD CONSTRAINT "IDDSpecialistSuggestionItemActionTaken_iDDSpecialistSugges_fkey" FOREIGN KEY ("iDDSpecialistSuggestionItemId") REFERENCES "IDDSpecialistSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
