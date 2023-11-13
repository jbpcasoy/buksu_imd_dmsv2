-- CreateTable
CREATE TABLE "ReturnedDepartmentRevisionSuggestionItemActionTaken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "returnedDepartmentRevisionSuggestionItemId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ReturnedDepartmentRevisionSuggestionItemActionTaken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReturnedDepartmentRevisionSuggestionItemActionTaken" ADD CONSTRAINT "ReturnedDepartmentRevisionSuggestionItemActionTaken_return_fkey" FOREIGN KEY ("returnedDepartmentRevisionSuggestionItemId") REFERENCES "ReturnedDepartmentRevisionSuggestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
