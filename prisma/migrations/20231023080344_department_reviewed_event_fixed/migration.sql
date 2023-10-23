/*
  Warnings:

  - The values [DEPARTMENT_REVVIEWED_CREATED] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('IM_CREATED', 'DEPARTMENT_REVIEW_CREATED', 'SUBMITTED_PEER_SUGGESTION_CREATED', 'SUBMITTED_COORDINATOR_SUGGESTION_CREATED', 'SUBMITTED_CHAIRPERSON_SUGGESTION_CREATED', 'DEPARTMENT_REVIEWED_CREATED');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;
