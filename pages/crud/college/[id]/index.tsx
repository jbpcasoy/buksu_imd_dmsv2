import CrudLayout from "@/components/CrudLayout";
import useCollege from "@/hooks/useCollege";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CollegePage() {
  const router = useRouter();
  const collegeId = router.query.id;
  const college = useCollege({ id: collegeId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/college/${collegeId}`)
      .then(() => {
        alert("College has been deleted successfully");
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message);
      });
  };

  if (!college) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">College</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/college/${collegeId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {college.id}</p>
      <p>createdAt: {new Date(college.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(college.updatedAt).toLocaleString()}</p>
      <p>name: {college.name}</p>
    </CrudLayout>
  );
}
