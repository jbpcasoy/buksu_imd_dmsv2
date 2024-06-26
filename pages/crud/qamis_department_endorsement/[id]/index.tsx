import CrudLayout from "@/components/CrudLayout";
import useQAMISDepartmentEndorsement from "@/hooks/useQAMISDepartmentEndorsement";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QAMISDepartmentEndorsementPage() {
  const router = useRouter();
  const qAMISDepartmentEndorsementId = router.query.id;
  const qAMISDepartmentEndorsement = useQAMISDepartmentEndorsement({
    id: qAMISDepartmentEndorsementId as string,
  });

  if (!qAMISDepartmentEndorsement) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">QAMISDepartmentEndorsement</h2>
        <div className="space-x-1"></div>
      </div>
      <p>id: {qAMISDepartmentEndorsement.id}</p>
      <p>
        createdAt:{" "}
        {new Date(qAMISDepartmentEndorsement.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(qAMISDepartmentEndorsement.updatedAt).toLocaleString()}
      </p>
      <p>
        qAMISChairpersonEndorsementId:
        <Link
          href={`/crud/qamis_chairperson_endorsement/${qAMISDepartmentEndorsement.qAMISChairpersonEndorsementId}`}
          className="underline"
        >
          {qAMISDepartmentEndorsement.qAMISChairpersonEndorsementId}
        </Link>
      </p>
      <p>
        qAMISCoordinatorEndorsementId:
        <Link
          href={`/crud/qamis_coordinator_endorsement/${qAMISDepartmentEndorsement.qAMISCoordinatorEndorsementId}`}
          className="underline"
        >
          {qAMISDepartmentEndorsement.qAMISCoordinatorEndorsementId}
        </Link>
      </p>
      <p>
        qAMISDeanEndorsementId:
        <Link
          href={`/crud/qamis_dean_endorsement/${qAMISDepartmentEndorsement.qAMISDeanEndorsementId}`}
          className="underline"
        >
          {qAMISDepartmentEndorsement.qAMISDeanEndorsementId}
        </Link>
      </p>
    </CrudLayout>
  );
}
