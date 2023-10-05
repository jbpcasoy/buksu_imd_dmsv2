-- CreateEnum
CREATE TYPE "IMType" AS ENUM ('MODULE', 'COURSE_FILE', 'WORKTEXT', 'TEXTBOOK');

-- CreateTable
CREATE TABLE "IM" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facultyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "IMType" NOT NULL,

    CONSTRAINT "IM_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IM" ADD CONSTRAINT "IM_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
