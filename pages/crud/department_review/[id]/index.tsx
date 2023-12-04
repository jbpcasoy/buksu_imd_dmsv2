import CrudLayout from "@/components/CrudLayout";
import useDepartmentReview from "@/hooks/useDepartmentReview";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DepartmentReviewPage() {
  const router = useRouter();
  const departmentReviewId = router.query.id;
  const departmentReview = useDepartmentReview({
    id: departmentReviewId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/department_review/${departmentReviewId}`)
      .then(() => {
        alert("DepartmentReview deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!departmentReview) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>DepartmentReview</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {departmentReview.id}</p>
      <p>createdAt: {new Date(departmentReview.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(departmentReview.updatedAt).toLocaleString()}</p>
      <p>
        iMFileId:{" "}
        <Link
          href={`/crud/im_file/${departmentReview.iMFileId}`}
          className='underline'
        >
          {departmentReview.iMFileId}
        </Link>
      </p>
    </CrudLayout>
  );
}
