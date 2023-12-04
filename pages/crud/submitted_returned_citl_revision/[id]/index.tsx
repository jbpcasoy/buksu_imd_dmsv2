import CrudLayout from "@/components/CrudLayout";
import useSubmittedReturnedCITLRevision from "@/hooks/useSubmittedReturnedCITLRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedReturnedCITLRevisionPage() {
  const router = useRouter();
  const submittedReturnedCITLRevisionId = router.query.id;
  const submittedReturnedCITLRevision =
    useSubmittedReturnedCITLRevision({
      id: submittedReturnedCITLRevisionId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/submitted_returned_citl_revision/${submittedReturnedCITLRevisionId}`
      )
      .then(() => {
        alert("SubmittedReturnedCITLRevision deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedReturnedCITLRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>SubmittedReturnedCITLRevision</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedReturnedCITLRevision.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          submittedReturnedCITLRevision.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          submittedReturnedCITLRevision.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        returnedCITLRevisionId:{" "}
        <Link
          href={`/crud/returned_citl_revision/${submittedReturnedCITLRevision.returnedCITLRevisionId}`}
          className='underline'
        >
          {submittedReturnedCITLRevision.returnedCITLRevisionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
