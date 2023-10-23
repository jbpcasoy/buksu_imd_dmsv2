/*
  Warnings:

  - The values [CITL_REVISION] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('IM_CREATED', 'DEPARTMENT_REVIEW_CREATED', 'SUBMITTED_PEER_SUGGESTION_CREATED', 'SUBMITTED_COORDINATOR_SUGGESTION_CREATED', 'SUBMITTED_CHAIRPERSON_SUGGESTION_CREATED', 'DEPARTMENT_REVIEWED_CREATED', 'DEPARTMENT_REVISION_CREATED', 'COORDINATOR_ENDORSEMENT', 'DEAN_ENDORSEMENT', 'SUBMITTED_IDD_COORDINATOR_SUGGESTION_CREATED', 'CITL_REVISION_CREATED', 'IDD_COORDINATOR_ENDORSEMENT_CREATED');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "iDDCoordinatorEndorsementId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iDDCoordinatorEndorsementId_fkey" FOREIGN KEY ("iDDCoordinatorEndorsementId") REFERENCES "IDDCoordinatorEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
