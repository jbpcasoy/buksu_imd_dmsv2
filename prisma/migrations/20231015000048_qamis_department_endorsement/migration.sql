/*
  Warnings:

  - You are about to drop the `QamisDepartmentEndorsement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QamisDepartmentEndorsement" DROP CONSTRAINT "QamisDepartmentEndorsement_qAMISChairpersonEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "QamisDepartmentEndorsement" DROP CONSTRAINT "QamisDepartmentEndorsement_qAMISCoordinatorEndorsementId_fkey";

-- DropForeignKey
ALTER TABLE "QamisDepartmentEndorsement" DROP CONSTRAINT "QamisDepartmentEndorsement_qAMISDeanEndorsementId_fkey";

-- DropTable
DROP TABLE "QamisDepartmentEndorsement";

-- CreateTable
CREATE TABLE "QAMISDepartmentEndorsement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qAMISDeanEndorsementId" TEXT NOT NULL,
    "qAMISChairpersonEndorsementId" TEXT NOT NULL,
    "qAMISCoordinatorEndorsementId" TEXT NOT NULL,

    CONSTRAINT "QAMISDepartmentEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QAMISDepartmentEndorsement_qAMISDeanEndorsementId_key" ON "QAMISDepartmentEndorsement"("qAMISDeanEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "QAMISDepartmentEndorsement_qAMISChairpersonEndorsementId_key" ON "QAMISDepartmentEndorsement"("qAMISChairpersonEndorsementId");

-- CreateIndex
CREATE UNIQUE INDEX "QAMISDepartmentEndorsement_qAMISCoordinatorEndorsementId_key" ON "QAMISDepartmentEndorsement"("qAMISCoordinatorEndorsementId");

-- AddForeignKey
ALTER TABLE "QAMISDepartmentEndorsement" ADD CONSTRAINT "QAMISDepartmentEndorsement_qAMISDeanEndorsementId_fkey" FOREIGN KEY ("qAMISDeanEndorsementId") REFERENCES "QAMISDeanEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISDepartmentEndorsement" ADD CONSTRAINT "QAMISDepartmentEndorsement_qAMISChairpersonEndorsementId_fkey" FOREIGN KEY ("qAMISChairpersonEndorsementId") REFERENCES "QAMISChairpersonEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QAMISDepartmentEndorsement" ADD CONSTRAINT "QAMISDepartmentEndorsement_qAMISCoordinatorEndorsementId_fkey" FOREIGN KEY ("qAMISCoordinatorEndorsementId") REFERENCES "QAMISCoordinatorEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
