-- CreateTable
CREATE TABLE "ContentSpecialist" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "ContentSpecialist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveContentSpecialist" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentSpecialistId" TEXT NOT NULL,

    CONSTRAINT "ActiveContentSpecialist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentSpecialist_departmentId_userId_key" ON "ContentSpecialist"("departmentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveContentSpecialist_contentSpecialistId_key" ON "ActiveContentSpecialist"("contentSpecialistId");

-- AddForeignKey
ALTER TABLE "ContentSpecialist" ADD CONSTRAINT "ContentSpecialist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSpecialist" ADD CONSTRAINT "ContentSpecialist_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveContentSpecialist" ADD CONSTRAINT "ActiveContentSpecialist_contentSpecialistId_fkey" FOREIGN KEY ("contentSpecialistId") REFERENCES "ContentSpecialist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
