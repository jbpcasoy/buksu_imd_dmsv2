import CrudLayout from "@/components/CrudLayout";
import useQAMISCoordinatorEndorsement from "@/hooks/useQAMISCoordinatorEndorsement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QAMISCoordinatorEndorsementPage() {
  const router = useRouter();
  const qAMISCoordinatorEndorsementId = router.query.id;
  const qAMISCoordinatorEndorsement = useQAMISCoordinatorEndorsement({
    id: qAMISCoordinatorEndorsementId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/qamis_coordinator_endorsement/${qAMISCoordinatorEndorsementId}`
      )
      .then(() => {
        alert("QAMISCoordinatorEndorsement deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!qAMISCoordinatorEndorsement) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>QAMISCoordinatorEndorsement</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {qAMISCoordinatorEndorsement.id}</p>
      <p>
        createdAt:{" "}
        {new Date(qAMISCoordinatorEndorsement.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(qAMISCoordinatorEndorsement.updatedAt).toLocaleString()}
      </p>
      <p>
        qAMISRevisionId:{" "}
        <Link
          href={`/crud/qamis_revision/${qAMISCoordinatorEndorsement.qAMISRevisionId}`}
          className='underline'
        >
          {qAMISCoordinatorEndorsement.qAMISRevisionId}
        </Link>
      </p>
      <p>
      coordinatorId:{" "}
        <Link
          href={`/crud/coordinator/${qAMISCoordinatorEndorsement.coordinatorId}`}
          className='underline'
        >
          {qAMISCoordinatorEndorsement.coordinatorId}
        </Link>
      </p>
    </CrudLayout>
  );
}
