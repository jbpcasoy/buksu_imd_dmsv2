/*
  Warnings:

  - The values [COORDINATOR_ENDORSEMENT,DEAN_ENDORSEMENT,QAMIS_COORDINATOR_ENDORSEMENT,QAMIS_CHAIRPERSON_ENDORSEMENT,QAMIS_DEAN_ENDORSEMENT,QAMIS_DEPARTMENT_ENDORSEMENT] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('IM_CREATED', 'DEPARTMENT_REVIEW_CREATED', 'SUBMITTED_PEER_SUGGESTION_CREATED', 'SUBMITTED_COORDINATOR_SUGGESTION_CREATED', 'SUBMITTED_CHAIRPERSON_SUGGESTION_CREATED', 'DEPARTMENT_REVIEWED_CREATED', 'DEPARTMENT_REVISION_CREATED', 'COORDINATOR_ENDORSEMENT_CREATED', 'DEAN_ENDORSEMENT_CREATED', 'SUBMITTED_IDD_COORDINATOR_SUGGESTION_CREATED', 'CITL_REVISION_CREATED', 'IDD_COORDINATOR_ENDORSEMENT_CREATED', 'CITL_DIRECTOR_ENDORSEMENT_CREATED', 'QAMIS_REVISION_CREATED', 'QAMIS_COORDINATOR_ENDORSEMENT_CREATED', 'QAMIS_CHAIRPERSON_ENDORSEMENT_CREATED', 'QAMIS_DEAN_ENDORSEMENT_CREATED', 'QAMIS_DEPARTMENT_ENDORSEMENT_CREATED', 'SUBMITTED_CONTENT_SPECIALIST_SUGGESTION_CREATED', 'SUBMITTED_IDD_SPECIALIST_SUGGESTION_CREATED', 'SUBMITTED_CONTENT_EDITOR_SUGGESTION_CREATED', 'IMERC_CITL_REVIEWED_CREATED', 'IMERC_CITL_REVISION_CREATED', 'IMERC_IDD_COORDINATOR_ENDORSEMENT_CREATED', 'IMERC_CITL_DIRECTOR_ENDORSEMENT_CREATED');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;
