import CrudLayout from "@/components/CrudLayout";
import useDepartmentRevision from "@/hooks/useDepartmentRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DepartmentRevisionPage() {
  const router = useRouter();
  const departmentRevisionId = router.query.id;
  const departmentRevision = useDepartmentRevision({
    id: departmentRevisionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/department_revision/${departmentRevisionId}`)
      .then(() => {
        alert("DepartmentRevision deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!departmentRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>DepartmentRevision</h2>
        <div className='space-x-1'>
          <Link href={`/crud/department_revision/${departmentRevision.id}/edit`} className="rounded border">edit</Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {departmentRevision.id}</p>
      <p>
        createdAt: {new Date(departmentRevision.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(departmentRevision.updatedAt).toLocaleString()}
      </p>
      <p>
        iMFileId:{" "}
        <Link
          href={`/crud/im_file/${departmentRevision.iMFileId}`}
          className='underline'
        >
          {departmentRevision.iMFileId}
        </Link>
      </p>
      <p>
        departmentReviewId:{" "}
        <Link
          href={`/crud/im_file/${departmentRevision.departmentReviewId}`}
          className='underline'
        >
          {departmentRevision.departmentReviewId}
        </Link>
      </p>
      <p>returned: {departmentRevision.returned ? "Yes" : "No"}</p>
    </CrudLayout>
  );
}
