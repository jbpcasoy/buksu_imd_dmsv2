/*
  Warnings:

  - You are about to drop the column `q8_5` on the `SyllabusChairpersonReview` table. All the data in the column will be lost.
  - You are about to drop the column `q8_6` on the `SyllabusChairpersonReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SyllabusChairpersonReview" DROP COLUMN "q8_5",
DROP COLUMN "q8_6",
ADD COLUMN     "q9_1" "SyllabusRating",
ADD COLUMN     "q9_2" "SyllabusRating",
ADD COLUMN     "q9_3" "SyllabusRating",
ADD COLUMN     "q9_4" "SyllabusRating",
ADD COLUMN     "q9_5" "SyllabusRating",
ADD COLUMN     "q9_6" "SyllabusRating";
