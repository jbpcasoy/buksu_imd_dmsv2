/*
  Warnings:

  - A unique constraint covering the columns `[facultyId]` on the table `Chairperson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facultyId]` on the table `Coordinator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facultyId]` on the table `Dean` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chairperson_facultyId_key" ON "Chairperson"("facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "Coordinator_facultyId_key" ON "Coordinator"("facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "Dean_facultyId_key" ON "Dean"("facultyId");
