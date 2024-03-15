import CrudLayout from "@/components/CrudLayout";
import useQAMISDeanEndorsement from "@/hooks/useQAMISDeanEndorsement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QAMISDeanEndorsementPage() {
  const router = useRouter();
  const qAMISDeanEndorsementId = router.query.id;
  const qAMISDeanEndorsement = useQAMISDeanEndorsement({
    id: qAMISDeanEndorsementId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/qamis_dean_endorsement/${qAMISDeanEndorsementId}`)
      .then(() => {
        alert("QAMISDeanEndorsement has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!qAMISDeanEndorsement) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">QAMISDeanEndorsement</h2>
        <div className="space-x-1">
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {qAMISDeanEndorsement.id}</p>
      <p>
        createdAt: {new Date(qAMISDeanEndorsement.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(qAMISDeanEndorsement.updatedAt).toLocaleString()}
      </p>
      <p>
        qAMISRevisionId:{" "}
        <Link
          href={`/crud/qamis_revision/${qAMISDeanEndorsement.qAMISRevisionId}`}
          className="underline"
        >
          {qAMISDeanEndorsement.qAMISRevisionId}
        </Link>
      </p>
      <p>
        deanId:{" "}
        <Link
          href={`/crud/dean/${qAMISDeanEndorsement.deanId}`}
          className="underline"
        >
          {qAMISDeanEndorsement.deanId}
        </Link>
      </p>
    </CrudLayout>
  );
}
