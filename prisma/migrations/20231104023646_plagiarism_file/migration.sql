-- CreateTable
CREATE TABLE "PlagiarismFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iMId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,

    CONSTRAINT "PlagiarismFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlagiarismFile" ADD CONSTRAINT "PlagiarismFile_iMId_fkey" FOREIGN KEY ("iMId") REFERENCES "IM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
