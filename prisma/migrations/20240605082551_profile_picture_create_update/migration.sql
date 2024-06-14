/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ProfilePictureFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProfilePictureFile_userId_key" ON "ProfilePictureFile"("userId");
