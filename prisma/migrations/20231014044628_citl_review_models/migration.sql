-- CreateTable
CREATE TABLE "IDDCoordinatorSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deanEndorsementId" TEXT NOT NULL,
    "iDDCoordinatorId" TEXT NOT NULL,

    CONSTRAINT "IDDCoordinatorSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IDDCoordinatorSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iDDCoordinatorSuggestionId" TEXT NOT NULL,

    CONSTRAINT "IDDCoordinatorSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedIDDCoordinatorSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iDDCoordinatorSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedIDDCoordinatorSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CITLRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedIDDCoordinatorSuggestionId" TEXT NOT NULL,
    "returned" BOOLEAN NOT NULL DEFAULT false,
    "iMFileId" TEXT NOT NULL,

    CONSTRAINT "CITLRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iDDCoordinatorEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cITLRevisionId" TEXT NOT NULL,

    CONSTRAINT "iDDCoordinatorEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CITLDirectorEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iDDCoordinatorEndorsementId" TEXT NOT NULL,

    CONSTRAINT "CITLDirectorEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IDDCoordinatorSuggestion_deanEndorsementId_key" ON "IDDCoordinatorSuggestion"("deanEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedIDDCoordinatorSuggestion_iDDCoordinatorSuggestionI_key" ON "SubmittedIDDCoordinatorSuggestion"("iDDCoordinatorSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "CITLRevision_iMFileId_key" ON "CITLRevision"("iMFileId");

-- CreateIndex
CREATE UNIQUE INDEX "iDDCoordinatorEndorsement_cITLRevisionId_key" ON "iDDCoordinatorEndorsement"("cITLRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "CITLDirectorEndorsement_iDDCoordinatorEndorsementId_key" ON "CITLDirectorEndorsement"("iDDCoordinatorEndorsementId");

-- AddForeignKey
ALTER TABLE "IDDCoordinatorSuggestion" ADD CONSTRAINT "IDDCoordinatorSuggestion_deanEndorsementId_fkey" FOREIGN KEY ("deanEndorsementId") REFERENCES "DeanEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDCoordinatorSuggestion" ADD CONSTRAINT "IDDCoordinatorSuggestion_iDDCoordinatorId_fkey" FOREIGN KEY ("iDDCoordinatorId") REFERENCES "IDDCoordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDDCoordinatorSuggestionItem" ADD CONSTRAINT "IDDCoordinatorSuggestionItem_iDDCoordinatorSuggestionId_fkey" FOREIGN KEY ("iDDCoordinatorSuggestionId") REFERENCES "IDDCoordinatorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedIDDCoordinatorSuggestion" ADD CONSTRAINT "SubmittedIDDCoordinatorSuggestion_iDDCoordinatorSuggestion_fkey" FOREIGN KEY ("iDDCoordinatorSuggestionId") REFERENCES "IDDCoordinatorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CITLRevision" ADD CONSTRAINT "CITLRevision_submittedIDDCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedIDDCoordinatorSuggestionId") REFERENCES "SubmittedIDDCoordinatorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CITLRevision" ADD CONSTRAINT "CITLRevision_iMFileId_fkey" FOREIGN KEY ("iMFileId") REFERENCES "IMFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iDDCoordinatorEndorsement" ADD CONSTRAINT "iDDCoordinatorEndorsement_cITLRevisionId_fkey" FOREIGN KEY ("cITLRevisionId") REFERENCES "CITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CITLDirectorEndorsement" ADD CONSTRAINT "CITLDirectorEndorsement_iDDCoordinatorEndorsementId_fkey" FOREIGN KEY ("iDDCoordinatorEndorsementId") REFERENCES "iDDCoordinatorEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
