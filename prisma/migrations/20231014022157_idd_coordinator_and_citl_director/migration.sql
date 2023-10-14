-- CreateTable
CREATE TABLE "IDDCoordinator" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "IDDCoordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveIDDCoordinator" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iDDCoordinatorId" TEXT NOT NULL,

    CONSTRAINT "ActiveIDDCoordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CITLDirector" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CITLDirector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveCITLDirector" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cITLDirectorId" TEXT NOT NULL,

    CONSTRAINT "ActiveCITLDirector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IDDCoordinator_userId_key" ON "IDDCoordinator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveIDDCoordinator_iDDCoordinatorId_key" ON "ActiveIDDCoordinator"("iDDCoordinatorId");

-- CreateIndex
CREATE UNIQUE INDEX "CITLDirector_userId_key" ON "CITLDirector"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveCITLDirector_cITLDirectorId_key" ON "ActiveCITLDirector"("cITLDirectorId");

-- AddForeignKey
ALTER TABLE "IDDCoordinator" ADD CONSTRAINT "IDDCoordinator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveIDDCoordinator" ADD CONSTRAINT "ActiveIDDCoordinator_iDDCoordinatorId_fkey" FOREIGN KEY ("iDDCoordinatorId") REFERENCES "IDDCoordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CITLDirector" ADD CONSTRAINT "CITLDirector_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveCITLDirector" ADD CONSTRAINT "ActiveCITLDirector_cITLDirectorId_fkey" FOREIGN KEY ("cITLDirectorId") REFERENCES "CITLDirector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
