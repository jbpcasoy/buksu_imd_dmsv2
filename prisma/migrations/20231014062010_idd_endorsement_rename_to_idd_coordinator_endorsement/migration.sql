/*
  Warnings:

  - You are about to drop the `iDDCoordinatorEndorsement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CITLDirectorEndorsement" DROP CONSTRAINT "CITLDirectorEndorsement_iDDCoordinatorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "iDDCoordinatorEndorsement" DROP CONSTRAINT "iDDCoordinatorEndorsement_cITLRevisionId_fkey";

-- DropTable
DROP TABLE "iDDCoordinatorEndorsement";

-- CreateTable
CREATE TABLE "IDDCoordinatorEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cITLRevisionId" TEXT NOT NULL,

    CONSTRAINT "IDDCoordinatorEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IDDCoordinatorEndorsement_cITLRevisionId_key" ON "IDDCoordinatorEndorsement"("cITLRevisionId");

-- AddForeignKey
ALTER TABLE "IDDCoordinatorEndorsement" ADD CONSTRAINT "IDDCoordinatorEndorsement_cITLRevisionId_fkey" FOREIGN KEY ("cITLRevisionId") REFERENCES "CITLRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CITLDirectorEndorsement" ADD CONSTRAINT "CITLDirectorEndorsement_iDDCoordinatorEndorsementId_fkey" FOREIGN KEY ("iDDCoordinatorEndorsementId") REFERENCES "IDDCoordinatorEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
