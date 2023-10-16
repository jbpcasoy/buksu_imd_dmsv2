import CrudLayout from "@/components/CrudLayout";
import useContentSpecialist from "@/hooks/useContentSpecialist";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ContentSpecialistPage() {
  const router = useRouter();
  const contentSpecialistId = router.query.id;
  const contentSpecialist = useContentSpecialist({ id: contentSpecialistId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/content_specialist/${contentSpecialistId}`)
      .then(() => {
        alert("ContentSpecialist deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!contentSpecialist) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ContentSpecialist</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {contentSpecialist.id}</p>
      <p>createdAt: {new Date(contentSpecialist.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(contentSpecialist.updatedAt).toLocaleString()}</p>
      <p>
        userId:{" "}
        <Link href={`/crud/user/${contentSpecialist.userId}`} className='underline'>
          {contentSpecialist.userId}
        </Link>
      </p>
      <p>
        departmentId:{" "}
        <Link
          href={`/crud/department/${contentSpecialist.departmentId}`}
          className='underline'
        >
          {contentSpecialist.departmentId}
        </Link>
      </p>
    </CrudLayout>
  );
}
