/*
  Warnings:

  - You are about to drop the column `returned` on the `CITLRevision` table. All the data in the column will be lost.
  - You are about to drop the column `returned` on the `DepartmentRevision` table. All the data in the column will be lost.
  - You are about to drop the column `returned` on the `IMERCCITLRevision` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CITLRevision" DROP COLUMN "returned";

-- AlterTable
ALTER TABLE "DepartmentRevision" DROP COLUMN "returned";

-- AlterTable
ALTER TABLE "IMERCCITLRevision" DROP COLUMN "returned";
