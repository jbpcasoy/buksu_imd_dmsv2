import CrudLayout from "@/components/CrudLayout";
import useReturnedCITLRevision from "@/hooks/useReturnedCITLRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReturnedCITLRevisionPage() {
  const router = useRouter();
  const returnedCITLRevisionId = router.query.id;
  const returnedCITLRevision = useReturnedCITLRevision({
    id: returnedCITLRevisionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/returned_citl_revision/${returnedCITLRevisionId}`)
      .then(() => {
        alert("ReturnedCITLRevision deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!returnedCITLRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ReturnedCITLRevision</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {returnedCITLRevision.id}</p>
      <p>
        createdAt: {new Date(returnedCITLRevision.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(returnedCITLRevision.updatedAt).toLocaleString()}
      </p>
      <p>
        iDDCoordinatorId:{" "}
        <Link
          href={`/crud/coordinator/${returnedCITLRevision.iDDCoordinatorId}`}
          className='underline'
        >
          {returnedCITLRevision.iDDCoordinatorId}
        </Link>
      </p>
      <p>
        cITLRevisionId:{" "}
        <Link
          href={`/crud/citl_revision/${returnedCITLRevision.cITLRevisionId}`}
          className='underline'
        >
          {returnedCITLRevision.cITLRevisionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
