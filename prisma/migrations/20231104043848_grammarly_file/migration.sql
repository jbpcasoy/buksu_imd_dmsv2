-- CreateTable
CREATE TABLE "GrammarlyFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iMId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,

    CONSTRAINT "GrammarlyFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GrammarlyFile" ADD CONSTRAINT "GrammarlyFile_iMId_fkey" FOREIGN KEY ("iMId") REFERENCES "IM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
