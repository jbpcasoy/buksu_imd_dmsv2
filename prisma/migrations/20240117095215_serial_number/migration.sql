-- CreateTable
CREATE TABLE "SerialNumber" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "iMERCCITLDirectorEndorsementId" TEXT NOT NULL,

    CONSTRAINT "SerialNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SerialNumber_value_key" ON "SerialNumber"("value");

-- CreateIndex
CREATE UNIQUE INDEX "SerialNumber_iMERCCITLDirectorEndorsementId_key" ON "SerialNumber"("iMERCCITLDirectorEndorsementId");

-- AddForeignKey
ALTER TABLE "SerialNumber" ADD CONSTRAINT "SerialNumber_iMERCCITLDirectorEndorsementId_fkey" FOREIGN KEY ("iMERCCITLDirectorEndorsementId") REFERENCES "IMERCCITLDirectorEndorsement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
