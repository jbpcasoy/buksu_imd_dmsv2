-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('IM_CREATED');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "EventType" NOT NULL,
    "iMId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMId_fkey" FOREIGN KEY ("iMId") REFERENCES "IM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
