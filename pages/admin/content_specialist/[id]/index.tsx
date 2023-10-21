import AdminLayout from "@/components/AdminLayout";
import useContentSpecialist from "@/hooks/useContentSpecialist";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
    <AdminLayout>
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
        facultyId:{" "}
        <Link
          href={`/admin/faculty/${contentSpecialist.facultyId}`}
          className='underline'
        >
          {contentSpecialist.facultyId}
        </Link>
      </p>
    </AdminLayout>
  );
}
