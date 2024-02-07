import CrudLayout from "@/components/CrudLayout";
import useReturnedIMERCCITLRevision from "@/hooks/useReturnedIMERCCITLRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReturnedIMERCCITLRevisionPage() {
  const router = useRouter();
  const returnedIMERCCITLRevisionId = router.query.id;
  const returnedIMERCCITLRevision = useReturnedIMERCCITLRevision({
    id: returnedIMERCCITLRevisionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/returned_imerc_citl_revision/${returnedIMERCCITLRevisionId}`)
      .then(() => {
        alert("ReturnedIMERCCITLRevision has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!returnedIMERCCITLRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ReturnedIMERCCITLRevision</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {returnedIMERCCITLRevision.id}</p>
      <p>
        createdAt: {new Date(returnedIMERCCITLRevision.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(returnedIMERCCITLRevision.updatedAt).toLocaleString()}
      </p>
      <p>
        iDDCoordinatorId:{" "}
        <Link
          href={`/crud/idd_coordinator/${returnedIMERCCITLRevision.iDDCoordinatorId}`}
          className='underline'
        >
          {returnedIMERCCITLRevision.iDDCoordinatorId}
        </Link>
      </p>
      <p>
        iMERCCITLRevisionId:{" "}
        <Link
          href={`/crud/imerc_citl_revision/${returnedIMERCCITLRevision.iMERCCITLRevisionId}`}
          className='underline'
        >
          {returnedIMERCCITLRevision.iMERCCITLRevisionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
