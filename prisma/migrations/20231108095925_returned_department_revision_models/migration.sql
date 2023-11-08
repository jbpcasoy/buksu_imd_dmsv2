-- CreateTable
CREATE TABLE "ReturnedDepartmentRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentRevisionId" TEXT NOT NULL,

    CONSTRAINT "ReturnedDepartmentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnedDepartmentRevisionSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedDepartmentRevisionId" TEXT NOT NULL,

    CONSTRAINT "ReturnedDepartmentRevisionSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedReturnedDepartmentRevision" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedDepartmentRevisionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedReturnedDepartmentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReturnedDepartmentRevision_departmentRevisionId_key" ON "ReturnedDepartmentRevision"("departmentRevisionId");

-- AddForeignKey
ALTER TABLE "ReturnedDepartmentRevision" ADD CONSTRAINT "ReturnedDepartmentRevision_departmentRevisionId_fkey" FOREIGN KEY ("departmentRevisionId") REFERENCES "DepartmentRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedDepartmentRevisionSuggestionItem" ADD CONSTRAINT "ReturnedDepartmentRevisionSuggestionItem_returnedDepartmen_fkey" FOREIGN KEY ("returnedDepartmentRevisionId") REFERENCES "ReturnedDepartmentRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedReturnedDepartmentRevision" ADD CONSTRAINT "SubmittedReturnedDepartmentRevision_returnedDepartmentRevi_fkey" FOREIGN KEY ("returnedDepartmentRevisionId") REFERENCES "ReturnedDepartmentRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
