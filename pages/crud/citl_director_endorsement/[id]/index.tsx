import CrudLayout from "@/components/CrudLayout";
import useCITLDirectorEndorsement from "@/hooks/useCITLDirectorEndorsement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CITLDirectorEndorsementPage() {
  const router = useRouter();
  const cITLDirectorEndorsementId = router.query.id;
  const cITLDirectorEndorsement = useCITLDirectorEndorsement({ id: cITLDirectorEndorsementId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/citl_director_endorsement/${cITLDirectorEndorsementId}`)
      .then(() => {
        alert("CITLDirectorEndorsement deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!cITLDirectorEndorsement) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>CITLDirectorEndorsement</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {cITLDirectorEndorsement.id}</p>
      <p>createdAt: {new Date(cITLDirectorEndorsement.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(cITLDirectorEndorsement.updatedAt).toLocaleString()}</p>
      <p>
      iDDCoordinatorEndorsementId:{" "}
        <Link
          href={`/crud/idd_coordinator_endorsement/${cITLDirectorEndorsement.iDDCoordinatorEndorsementId}`}
          className='underline'
        >
          {cITLDirectorEndorsement.iDDCoordinatorEndorsementId}
        </Link>
      </p>
      <p>
      cITLDirectorId:{" "}
        <Link
          href={`/crud/cITLDirector/${cITLDirectorEndorsement.cITLDirectorId}`}
          className='underline'
        >
          {cITLDirectorEndorsement.cITLDirectorId}
        </Link>
      </p>
    </CrudLayout>
  );
}
