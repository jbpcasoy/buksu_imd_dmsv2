-- CreateTable
CREATE TABLE "ActiveCoordinator" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coordinatorId" TEXT NOT NULL,

    CONSTRAINT "ActiveCoordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveChairperson" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chairpersonId" TEXT NOT NULL,

    CONSTRAINT "ActiveChairperson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveDean" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deanId" TEXT NOT NULL,

    CONSTRAINT "ActiveDean_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveCoordinator_coordinatorId_key" ON "ActiveCoordinator"("coordinatorId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveChairperson_chairpersonId_key" ON "ActiveChairperson"("chairpersonId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveDean_deanId_key" ON "ActiveDean"("deanId");

-- AddForeignKey
ALTER TABLE "ActiveCoordinator" ADD CONSTRAINT "ActiveCoordinator_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveChairperson" ADD CONSTRAINT "ActiveChairperson_chairpersonId_fkey" FOREIGN KEY ("chairpersonId") REFERENCES "Chairperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveDean" ADD CONSTRAINT "ActiveDean_deanId_fkey" FOREIGN KEY ("deanId") REFERENCES "Dean"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
