-- CreateTable
CREATE TABLE "DepartmentRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentReviewId" TEXT NOT NULL,
    "iMFileId" TEXT NOT NULL,
    "returned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DepartmentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoordinatorEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentRevisionId" TEXT NOT NULL,

    CONSTRAINT "CoordinatorEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeanEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coordinatorEndorsementId" TEXT NOT NULL,

    CONSTRAINT "DeanEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentRevision_iMFileId_key" ON "DepartmentRevision"("iMFileId");

-- CreateIndex
CREATE UNIQUE INDEX "CoordinatorEndorsement_departmentRevisionId_key" ON "CoordinatorEndorsement"("departmentRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "DeanEndorsement_coordinatorEndorsementId_key" ON "DeanEndorsement"("coordinatorEndorsementId");

-- AddForeignKey
ALTER TABLE "DepartmentRevision" ADD CONSTRAINT "DepartmentRevision_departmentReviewId_fkey" FOREIGN KEY ("departmentReviewId") REFERENCES "DepartmentReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentRevision" ADD CONSTRAINT "DepartmentRevision_iMFileId_fkey" FOREIGN KEY ("iMFileId") REFERENCES "IMFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorEndorsement" ADD CONSTRAINT "CoordinatorEndorsement_departmentRevisionId_fkey" FOREIGN KEY ("departmentRevisionId") REFERENCES "DepartmentRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeanEndorsement" ADD CONSTRAINT "DeanEndorsement_coordinatorEndorsementId_fkey" FOREIGN KEY ("coordinatorEndorsementId") REFERENCES "CoordinatorEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
