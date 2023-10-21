import AdminLayout from "@/components/AdminLayout";
import useDean from "@/hooks/useDean";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DeanPage() {
  const router = useRouter();
  const deanId = router.query.id;
  const dean = useDean({ id: deanId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/dean/${deanId}`)
      .then(() => {
        alert("Dean deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!dean) return null;

  return (
    <AdminLayout>
      <div className='flex'>
        <h2 className='flex-1'>Dean</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {dean.id}</p>
      <p>createdAt: {new Date(dean.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(dean.updatedAt).toLocaleString()}</p>
      <p>
        facultyId:{" "}
        <Link
          href={`/admin/faculty/${dean.facultyId}`}
          className='underline'
        >
          {dean.facultyId}
        </Link>
      </p>
    </AdminLayout>
  );
}
