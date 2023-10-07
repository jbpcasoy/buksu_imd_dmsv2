/*
  Warnings:

  - Added the required column `mimetype` to the `ActiveIMFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFilename` to the `ActiveIMFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `ActiveIMFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiveIMFile" ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "originalFilename" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
