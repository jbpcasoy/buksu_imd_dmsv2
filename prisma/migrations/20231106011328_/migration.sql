/*
  Warnings:

  - You are about to drop the `GrammarlyFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GrammarlyFile" DROP CONSTRAINT "GrammarlyFile_iMId_fkey";

-- DropTable
DROP TABLE "GrammarlyFile";
