/*
  Warnings:

  - A unique constraint covering the columns `[departmentId,userId]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Faculty_departmentId_userId_key" ON "Faculty"("departmentId", "userId");
