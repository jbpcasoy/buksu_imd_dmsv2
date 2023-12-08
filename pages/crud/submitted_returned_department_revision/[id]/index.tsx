import CrudLayout from "@/components/CrudLayout";
import useSubmittedReturnedDepartmentRevision from "@/hooks/useSubmittedReturnedDepartmentRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedReturnedDepartmentRevisionPage() {
  const router = useRouter();
  const submittedReturnedDepartmentRevisionId = router.query.id;
  const submittedReturnedDepartmentRevision =
    useSubmittedReturnedDepartmentRevision({
      id: submittedReturnedDepartmentRevisionId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/submitted_returned_department_revision/${submittedReturnedDepartmentRevisionId}`
      )
      .then(() => {
        alert("SubmittedReturnedDepartmentRevision has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedReturnedDepartmentRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>SubmittedReturnedDepartmentRevision</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedReturnedDepartmentRevision.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          submittedReturnedDepartmentRevision.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          submittedReturnedDepartmentRevision.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        returnedDepartmentRevisionId:{" "}
        <Link
          href={`/crud/returned_department_revision/${submittedReturnedDepartmentRevision.returnedDepartmentRevisionId}`}
          className='underline'
        >
          {submittedReturnedDepartmentRevision.returnedDepartmentRevisionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
