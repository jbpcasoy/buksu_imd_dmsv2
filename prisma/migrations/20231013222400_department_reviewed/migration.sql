/*
  Warnings:

  - You are about to drop the `DepartmentRevised` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DepartmentRevised" DROP CONSTRAINT "DepartmentRevised_submittedChairpersonSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentRevised" DROP CONSTRAINT "DepartmentRevised_submittedCoordinatorSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentRevised" DROP CONSTRAINT "DepartmentRevised_submittedPeerSuggestionId_fkey";

-- DropTable
DROP TABLE "DepartmentRevised";

-- CreateTable
CREATE TABLE "DepartmentReviewed" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedCoordinatorSuggestionId" TEXT NOT NULL,
    "submittedChairpersonSuggestionId" TEXT NOT NULL,
    "submittedPeerSuggestionId" TEXT NOT NULL,

    CONSTRAINT "DepartmentReviewed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentReviewed_submittedCoordinatorSuggestionId_key" ON "DepartmentReviewed"("submittedCoordinatorSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentReviewed_submittedChairpersonSuggestionId_key" ON "DepartmentReviewed"("submittedChairpersonSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentReviewed_submittedPeerSuggestionId_key" ON "DepartmentReviewed"("submittedPeerSuggestionId");

-- AddForeignKey
ALTER TABLE "DepartmentReviewed" ADD CONSTRAINT "DepartmentReviewed_submittedCoordinatorSuggestionId_fkey" FOREIGN KEY ("submittedCoordinatorSuggestionId") REFERENCES "SubmittedCoordinatorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentReviewed" ADD CONSTRAINT "DepartmentReviewed_submittedChairpersonSuggestionId_fkey" FOREIGN KEY ("submittedChairpersonSuggestionId") REFERENCES "SubmittedChairpersonSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentReviewed" ADD CONSTRAINT "DepartmentReviewed_submittedPeerSuggestionId_fkey" FOREIGN KEY ("submittedPeerSuggestionId") REFERENCES "SubmittedPeerSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
