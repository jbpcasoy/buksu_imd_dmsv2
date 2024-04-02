import CrudLayout from "@/components/CrudLayout";
import useSyllabusDepartmentReview from "@/hooks/useSyllabusDepartmentReview";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SyllabusDepartmentReviewPage() {
  const router = useRouter();
  const syllabusDepartmentReviewId = router.query.id as string;
  const syllabusDepartmentReview = useSyllabusDepartmentReview({
    id: syllabusDepartmentReviewId,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/syllabus_department_review/${syllabusDepartmentReviewId}`)
      .then(() => {
        alert("DepartmentReview has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!syllabusDepartmentReview) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">SyllabusDepartmentReview</h2>
        <div className="space-x-1">
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {syllabusDepartmentReview.id}</p>
      <p>
        createdAt:{" "}
        {new Date(syllabusDepartmentReview.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(syllabusDepartmentReview.updatedAt).toLocaleString()}
      </p>
      <p>
        syllabusFileId:{" "}
        <Link
          href={`/crud/syllabus_file/${syllabusDepartmentReview.syllabusFileId}`}
          className="underline"
        >
          {syllabusDepartmentReview.syllabusFileId}
        </Link>
      </p>
    </CrudLayout>
  );
}
