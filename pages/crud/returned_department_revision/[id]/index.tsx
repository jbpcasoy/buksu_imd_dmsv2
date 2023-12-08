import CrudLayout from "@/components/CrudLayout";
import useReturnedDepartmentRevision from "@/hooks/useReturnedDepartmentRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReturnedDepartmentRevisionPage() {
  const router = useRouter();
  const returnedDepartmentRevisionId = router.query.id;
  const returnedDepartmentRevision = useReturnedDepartmentRevision({
    id: returnedDepartmentRevisionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/returned_department_revision/${returnedDepartmentRevisionId}`
      )
      .then(() => {
        alert("ReturnedDepartmentRevision has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!returnedDepartmentRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ReturnedDepartmentRevision</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {returnedDepartmentRevision.id}</p>
      <p>
        createdAt:{" "}
        {new Date(returnedDepartmentRevision.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(returnedDepartmentRevision.updatedAt).toLocaleString()}
      </p>
      <p>
        coordinatorId:{" "}
        <Link
          href={`/crud/coordinator/${returnedDepartmentRevision.coordinatorId}`}
          className='underline'
        >
          {returnedDepartmentRevision.coordinatorId}
        </Link>
      </p>
      <p>
        departmentRevisionId:{" "}
        <Link
          href={`/crud/department_revision/${returnedDepartmentRevision.departmentRevisionId}`}
          className='underline'
        >
          {returnedDepartmentRevision.departmentRevisionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
