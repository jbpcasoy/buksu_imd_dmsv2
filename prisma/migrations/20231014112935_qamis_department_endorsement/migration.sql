-- CreateTable
CREATE TABLE "QAMISSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cITLDirectorEndorsementId" TEXT NOT NULL,

    CONSTRAINT "QAMISSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QAMISSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qAMISSuggestionId" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "actionTaken" TEXT,
    "remarks" TEXT,
    "pageNumber" INTEGER NOT NULL,

    CONSTRAINT "QAMISSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedQAMISSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qAMISSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedQAMISSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QAMISFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "qAMISSuggestionId" TEXT NOT NULL,

    CONSTRAINT "QAMISFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QAMISRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qAMISFileId" TEXT NOT NULL,
    "submittedQAMISSuggestionId" TEXT NOT NULL,

    CONSTRAINT "QAMISRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QAMISCoordinatorEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qAMISRevisionId" TEXT NOT NULL,
    "coordinatorId" TEXT NOT NULL,

    CONSTRAINT "QAMISCoordinatorEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QAMISChairpersonEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qAMISRevisionId" TEXT NOT NULL,
    "chairpersonId" TEXT NOT NULL,

    CONSTRAINT "QAMISChairpersonEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QAMISDeanEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qAMISRevisionId" TEXT NOT NULL,
    "deanId" TEXT NOT NULL,

    CONSTRAINT "QAMISDeanEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QamisDepartmentEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qAMISDeanEndorsementId" TEXT NOT NULL,
    "qAMISChairpersonEndorsementId" TEXT NOT NULL,
    "qAMISCoordinatorEndorsementId" TEXT NOT NULL,

    CONSTRAINT "QamisDepartmentEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QAMISSuggestion_cITLDirectorEndorsementId_key" ON "QAMISSuggestion"("cITLDirectorEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedQAMISSuggestion_qAMISSuggestionId_key" ON "SubmittedQAMISSuggestion"("qAMISSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "QAMISRevision_qAMISFileId_key" ON "QAMISRevision"("qAMISFileId");

-- CreateIndex
CREATE UNIQUE INDEX "QAMISRevision_submittedQAMISSuggestionId_key" ON "QAMISRevision"("submittedQAMISSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "QAMISCoordinatorEndorsement_qAMISRevisionId_key" ON "QAMISCoordinatorEndorsement"("qAMISRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "QAMISChairpersonEndorsement_qAMISRevisionId_key" ON "QAMISChairpersonEndorsement"("qAMISRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "QAMISDeanEndorsement_qAMISRevisionId_key" ON "QAMISDeanEndorsement"("qAMISRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "QamisDepartmentEndorsement_qAMISDeanEndorsementId_key" ON "QamisDepartmentEndorsement"("qAMISDeanEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "QamisDepartmentEndorsement_qAMISChairpersonEndorsementId_key" ON "QamisDepartmentEndorsement"("qAMISChairpersonEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "QamisDepartmentEndorsement_qAMISCoordinatorEndorsementId_key" ON "QamisDepartmentEndorsement"("qAMISCoordinatorEndorsementId");

-- AddForeignKey
ALTER TABLE "QAMISSuggestion" ADD CONSTRAINT "QAMISSuggestion_cITLDirectorEndorsementId_fkey" FOREIGN KEY ("cITLDirectorEndorsementId") REFERENCES "CITLDirectorEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISSuggestionItem" ADD CONSTRAINT "QAMISSuggestionItem_qAMISSuggestionId_fkey" FOREIGN KEY ("qAMISSuggestionId") REFERENCES "QAMISSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedQAMISSuggestion" ADD CONSTRAINT "SubmittedQAMISSuggestion_qAMISSuggestionId_fkey" FOREIGN KEY ("qAMISSuggestionId") REFERENCES "QAMISSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISFile" ADD CONSTRAINT "QAMISFile_qAMISSuggestionId_fkey" FOREIGN KEY ("qAMISSuggestionId") REFERENCES "QAMISSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISRevision" ADD CONSTRAINT "QAMISRevision_qAMISFileId_fkey" FOREIGN KEY ("qAMISFileId") REFERENCES "QAMISFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISRevision" ADD CONSTRAINT "QAMISRevision_submittedQAMISSuggestionId_fkey" FOREIGN KEY ("submittedQAMISSuggestionId") REFERENCES "SubmittedQAMISSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISCoordinatorEndorsement" ADD CONSTRAINT "QAMISCoordinatorEndorsement_qAMISRevisionId_fkey" FOREIGN KEY ("qAMISRevisionId") REFERENCES "QAMISRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISCoordinatorEndorsement" ADD CONSTRAINT "QAMISCoordinatorEndorsement_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISChairpersonEndorsement" ADD CONSTRAINT "QAMISChairpersonEndorsement_qAMISRevisionId_fkey" FOREIGN KEY ("qAMISRevisionId") REFERENCES "QAMISRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISChairpersonEndorsement" ADD CONSTRAINT "QAMISChairpersonEndorsement_chairpersonId_fkey" FOREIGN KEY ("chairpersonId") REFERENCES "Chairperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISDeanEndorsement" ADD CONSTRAINT "QAMISDeanEndorsement_qAMISRevisionId_fkey" FOREIGN KEY ("qAMISRevisionId") REFERENCES "QAMISRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISDeanEndorsement" ADD CONSTRAINT "QAMISDeanEndorsement_deanId_fkey" FOREIGN KEY ("deanId") REFERENCES "Dean"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QamisDepartmentEndorsement" ADD CONSTRAINT "QamisDepartmentEndorsement_qAMISDeanEndorsementId_fkey" FOREIGN KEY ("qAMISDeanEndorsementId") REFERENCES "QAMISDeanEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QamisDepartmentEndorsement" ADD CONSTRAINT "QamisDepartmentEndorsement_qAMISChairpersonEndorsementId_fkey" FOREIGN KEY ("qAMISChairpersonEndorsementId") REFERENCES "QAMISChairpersonEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QamisDepartmentEndorsement" ADD CONSTRAINT "QamisDepartmentEndorsement_qAMISCoordinatorEndorsementId_fkey" FOREIGN KEY ("qAMISCoordinatorEndorsementId") REFERENCES "QAMISCoordinatorEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
