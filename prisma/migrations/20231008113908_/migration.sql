/*
  Warnings:

  - You are about to drop the column `fileId` on the `ActiveIMFile` table. All the data in the column will be lost.
  - You are about to drop the column `mimetype` on the `ActiveIMFile` table. All the data in the column will be lost.
  - You are about to drop the column `originalFilename` on the `ActiveIMFile` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ActiveIMFile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[iMFileId]` on the table `ActiveIMFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iMFileId` to the `ActiveIMFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `IMFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFilename` to the `IMFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `IMFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActiveIMFile" DROP CONSTRAINT "ActiveIMFile_fileId_fkey";

-- DropIndex
DROP INDEX "ActiveIMFile_fileId_key";

-- AlterTable
ALTER TABLE "ActiveIMFile" DROP COLUMN "fileId",
DROP COLUMN "mimetype",
DROP COLUMN "originalFilename",
DROP COLUMN "size",
ADD COLUMN     "iMFileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IMFile" ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "originalFilename" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ActiveIMFile_iMFileId_key" ON "ActiveIMFile"("iMFileId");

-- AddForeignKey
ALTER TABLE "ActiveIMFile" ADD CONSTRAINT "ActiveIMFile_iMFileId_fkey" FOREIGN KEY ("iMFileId") REFERENCES "IMFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
