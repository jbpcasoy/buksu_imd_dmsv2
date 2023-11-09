-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_submittedReturnedDepartmentRevisionId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "submittedReturnedCITLRevisionId" TEXT;

-- CreateTable
CREATE TABLE "ReturnedCITLRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cITLRevisionId" TEXT NOT NULL,
    "coordinatorId" TEXT NOT NULL,

    CONSTRAINT "ReturnedCITLRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedCITLRevisionSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedCITLRevisionId" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "actionTaken" TEXT,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,

    CONSTRAINT "ReturnedCITLRevisionSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedReturnedCITLRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedCITLRevisionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedReturnedCITLRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedCITLRevision_cITLRevisionId_key" ON "ReturnedCITLRevision"("cITLRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedReturnedCITLRevision_returnedCITLRevisionId_key" ON "SubmittedReturnedCITLRevision"("returnedCITLRevisionId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedReturnedDepartmentRevisionId_fkey" FOREIGN KEY ("submittedReturnedDepartmentRevisionId") REFERENCES "SubmittedReturnedDepartmentRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_submittedReturnedCITLRevisionId_fkey" FOREIGN KEY ("submittedReturnedCITLRevisionId") REFERENCES "SubmittedReturnedCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedCITLRevision" ADD CONSTRAINT "ReturnedCITLRevision_cITLRevisionId_fkey" FOREIGN KEY ("cITLRevisionId") REFERENCES "CITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedCITLRevision" ADD CONSTRAINT "ReturnedCITLRevision_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedCITLRevisionSuggestionItem" ADD CONSTRAINT "ReturnedCITLRevisionSuggestionItem_returnedCITLRevisionId_fkey" FOREIGN KEY ("returnedCITLRevisionId") REFERENCES "ReturnedCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedReturnedCITLRevision" ADD CONSTRAINT "SubmittedReturnedCITLRevision_returnedCITLRevisionId_fkey" FOREIGN KEY ("returnedCITLRevisionId") REFERENCES "ReturnedCITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
