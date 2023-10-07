/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `ActiveIMFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ActiveIMFile_fileId_key" ON "ActiveIMFile"("fileId");
