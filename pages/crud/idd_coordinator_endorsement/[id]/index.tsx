import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorEndorsement from "@/hooks/useIDDCoordinatorEndorsement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDCoordinatorEndorsementPage() {
  const router = useRouter();
  const iDDCoordinatorEndorsementId = router.query.id;
  const iDDCoordinatorEndorsement = useIDDCoordinatorEndorsement({ id: iDDCoordinatorEndorsementId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/idd_coordinator_endorsement/${iDDCoordinatorEndorsementId}`)
      .then(() => {
        alert("IDDCoordinatorEndorsement deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iDDCoordinatorEndorsement) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IDDCoordinatorEndorsement</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iDDCoordinatorEndorsement.id}</p>
      <p>createdAt: {new Date(iDDCoordinatorEndorsement.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iDDCoordinatorEndorsement.updatedAt).toLocaleString()}</p>
      <p>
      cITLRevisionId:{" "}
        <Link
          href={`/crud/department_revision/${iDDCoordinatorEndorsement.cITLRevisionId}`}
          className='underline'
        >
          {iDDCoordinatorEndorsement.cITLRevisionId}
        </Link>
      </p>
      <p>
      iDDCoordinatorId:{" "}
        <Link
          href={`/crud/iDDCoordinator/${iDDCoordinatorEndorsement.iDDCoordinatorId}`}
          className='underline'
        >
          {iDDCoordinatorEndorsement.iDDCoordinatorId}
        </Link>
      </p>
    </CrudLayout>
  );
}
