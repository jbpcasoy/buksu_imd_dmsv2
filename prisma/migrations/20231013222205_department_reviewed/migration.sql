-- CreateTable
CREATE TABLE "DepartmentRevised" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedCoordinatorSuggestionId" TEXT NOT NULL,
    "submittedChairpersonSuggestionId" TEXT NOT NULL,
    "submittedPeerSuggestionId" TEXT NOT NULL,

    CONSTRAINT "DepartmentRevised_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentRevised_submittedCoordinatorSuggestionId_key" ON "DepartmentRevised"("submittedCoordinatorSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentRevised_submittedChairpersonSuggestionId_key" ON "DepartmentRevised"("submittedChairpersonSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentRevised_submittedPeerSuggestionId_key" ON "DepartmentRevised"("submittedPeerSuggestionId");

-- AddForeignKey
ALTER TABLE "DepartmentRevised" ADD CONSTRAINT "DepartmentRevised_submittedCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedCoordinatorSuggestionId") REFERENCES "SubmittedCoordinatorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentRevised" ADD CONSTRAINT "DepartmentRevised_submittedChairpersonSuggestionId_fkey" FOREIGN KEY ("submittedChairpersonSuggestionId") REFERENCES "SubmittedChairpersonSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentRevised" ADD CONSTRAINT "DepartmentRevised_submittedPeerSuggestionId_fkey" FOREIGN KEY ("submittedPeerSuggestionId") REFERENCES "SubmittedPeerSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
