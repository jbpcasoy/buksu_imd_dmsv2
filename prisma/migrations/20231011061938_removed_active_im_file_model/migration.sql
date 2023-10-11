/*
  Warnings:

  - You are about to drop the `ActiveIMFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActiveIMFile" DROP CONSTRAINT "ActiveIMFile_iMFileId_fkey";

-- DropTable
DROP TABLE "ActiveIMFile";
