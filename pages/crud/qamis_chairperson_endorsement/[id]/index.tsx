import CrudLayout from "@/components/CrudLayout";
import useQAMISChairpersonEndorsement from "@/hooks/useQAMISChairpersonEndorsement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QAMISChairpersonEndorsementPage() {
  const router = useRouter();
  const qAMISChairpersonEndorsementId = router.query.id;
  const qAMISChairpersonEndorsement = useQAMISChairpersonEndorsement({
    id: qAMISChairpersonEndorsementId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/qamis_chairperson_endorsement/${qAMISChairpersonEndorsementId}`
      )
      .then(() => {
        alert("QAMISChairpersonEndorsement has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!qAMISChairpersonEndorsement) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">QAMISChairpersonEndorsement</h2>
        <div className="space-x-1">
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {qAMISChairpersonEndorsement.id}</p>
      <p>
        createdAt:{" "}
        {new Date(qAMISChairpersonEndorsement.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(qAMISChairpersonEndorsement.updatedAt).toLocaleString()}
      </p>
      <p>
        qAMISRevisionId:{" "}
        <Link
          href={`/crud/qamis_revision/${qAMISChairpersonEndorsement.qAMISRevisionId}`}
          className="underline"
        >
          {qAMISChairpersonEndorsement.qAMISRevisionId}
        </Link>
      </p>
      <p>
        chairpersonId:{" "}
        <Link
          href={`/crud/chairperson/${qAMISChairpersonEndorsement.chairpersonId}`}
          className="underline"
        >
          {qAMISChairpersonEndorsement.chairpersonId}
        </Link>
      </p>
    </CrudLayout>
  );
}
