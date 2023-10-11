-- CreateTable
CREATE TABLE "CoordinatorReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "q1_1" "Rating",
    "q1_2" "Rating",
    "q2_1" "Rating",
    "q2_2" "Rating",
    "q2_3" "Rating",
    "q2_4" "Rating",
    "q3_1" "Rating",
    "q4_1" "Rating",
    "q4_2" "Rating",
    "q4_3" "Rating",
    "q5_1" "Rating",
    "q5_2" "Rating",
    "q5_3" "Rating",
    "q6_1" "Rating",
    "q6_2" "Rating",
    "q6_3" "Rating",
    "q6_4" "Rating",
    "q6_5" "Rating",
    "q7_1" "Rating",
    "q7_2" "Rating",
    "q7_3" "Rating",
    "q7_4" "Rating",
    "q7_5" "Rating",
    "q8_1" "Rating",
    "q8_2" "Rating",
    "q8_3" "Rating",
    "departmentReviewId" TEXT NOT NULL,

    CONSTRAINT "CoordinatorReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoordinatorSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coordinatorReviewId" TEXT NOT NULL,

    CONSTRAINT "CoordinatorSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoordinatorSuggestionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "suggestion" TEXT NOT NULL,
    "actionTaken" TEXT,
    "remarks" TEXT,
    "coordinatorSuggestionId" TEXT NOT NULL,

    CONSTRAINT "CoordinatorSuggestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmittedCoordinatorSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coordinatorSuggestionId" TEXT NOT NULL,

    CONSTRAINT "SubmittedCoordinatorSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoordinatorReview_departmentReviewId_key" ON "CoordinatorReview"("departmentReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "CoordinatorSuggestion_coordinatorReviewId_key" ON "CoordinatorSuggestion"("coordinatorReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmittedCoordinatorSuggestion_coordinatorSuggestionId_key" ON "SubmittedCoordinatorSuggestion"("coordinatorSuggestionId");

-- AddForeignKey
ALTER TABLE "CoordinatorReview" ADD CONSTRAINT "CoordinatorReview_departmentReviewId_fkey" FOREIGN KEY ("departmentReviewId") REFERENCES "DepartmentReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorSuggestion" ADD CONSTRAINT "CoordinatorSuggestion_coordinatorReviewId_fkey" FOREIGN KEY ("coordinatorReviewId") REFERENCES "CoordinatorReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorSuggestionItem" ADD CONSTRAINT "CoordinatorSuggestionItem_coordinatorSuggestionId_fkey" FOREIGN KEY ("coordinatorSuggestionId") REFERENCES "CoordinatorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedCoordinatorSuggestion" ADD CONSTRAINT "SubmittedCoordinatorSuggestion_coordinatorSuggestionId_fkey" FOREIGN KEY ("coordinatorSuggestionId") REFERENCES "CoordinatorSuggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
