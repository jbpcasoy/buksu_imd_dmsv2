-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "submittedReturnedIMERCCITLRevisionId" TEXT;

-- CreateTable
CREATE TABLE "ReturnedIMERCCITLRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iMERCCITLRevisionId" TEXT NOT NULL,
    "iDDCoordinatorId" TEXT NOT NULL,

    CONSTRAINT "ReturnedIMERCCITLRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedIMERCCITLRevisionSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedIMERCCITLRevisionId" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "actionTaken" TEXT,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,

    CONSTRAINT "ReturnedIMERCCITLRevisionSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedReturnedIMERCCITLRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedIMERCCITLRevisionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedReturnedIMERCCITLRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedIMERCCITLRevision_iMERCCITLRevisionId_key" ON "ReturnedIMERCCITLRevision"("iMERCCITLRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedReturnedIMERCCITLRevision_returnedIMERCCITLRevisio_key" ON "SubmittedReturnedIMERCCITLRevision"("returnedIMERCCITLRevisionId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedReturnedIMERCCITLRevisionId_fkey" FOREIGN KEY ("submittedReturnedIMERCCITLRevisionId") REFERENCES "SubmittedReturnedIMERCCITLRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedIMERCCITLRevision" ADD CONSTRAINT "ReturnedIMERCCITLRevision_iMERCCITLRevisionId_fkey" FOREIGN KEY ("iMERCCITLRevisionId") REFERENCES "IMERCCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedIMERCCITLRevision" ADD CONSTRAINT "ReturnedIMERCCITLRevision_iDDCoordinatorId_fkey" FOREIGN KEY ("iDDCoordinatorId") REFERENCES "IDDCoordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedIMERCCITLRevisionSuggestionItem" ADD CONSTRAINT "ReturnedIMERCCITLRevisionSuggestionItem_returnedIMERCCITLR_fkey" FOREIGN KEY ("returnedIMERCCITLRevisionId") REFERENCES "ReturnedIMERCCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedReturnedIMERCCITLRevision" ADD CONSTRAINT "SubmittedReturnedIMERCCITLRevision_returnedIMERCCITLRevisi_fkey" FOREIGN KEY ("returnedIMERCCITLRevisionId") REFERENCES "ReturnedIMERCCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
