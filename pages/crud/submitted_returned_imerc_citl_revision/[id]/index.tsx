import CrudLayout from "@/components/CrudLayout";
import useSubmittedReturnedIMERCCITLRevision from "@/hooks/useSubmittedReturnedIMERCCITLRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedReturnedIMERCCITLRevisionPage() {
  const router = useRouter();
  const submittedReturnedIMERCCITLRevisionId = router.query.id;
  const submittedReturnedIMERCCITLRevision =
    useSubmittedReturnedIMERCCITLRevision({
      id: submittedReturnedIMERCCITLRevisionId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/submitted_returned_imerc_citl_revision/${submittedReturnedIMERCCITLRevisionId}`
      )
      .then(() => {
        alert("SubmittedReturnedIMERCCITLRevision deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedReturnedIMERCCITLRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>SubmittedReturnedIMERCCITLRevision</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedReturnedIMERCCITLRevision.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          submittedReturnedIMERCCITLRevision.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          submittedReturnedIMERCCITLRevision.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        returnedIMERCCITLRevisionId:{" "}
        <Link
          href={`/crud/returned_imerc_citl_revision/${submittedReturnedIMERCCITLRevision.returnedIMERCCITLRevisionId}`}
          className='underline'
        >
          {submittedReturnedIMERCCITLRevision.returnedIMERCCITLRevisionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
