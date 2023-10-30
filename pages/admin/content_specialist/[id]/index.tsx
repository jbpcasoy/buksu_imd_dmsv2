import AdminLayout from "@/components/AdminLayout";
import useActiveContentSpecialistByContentSpecialistId from "@/hooks/useActiveContentSpecialistByContentSpecialistId";
import useActiveFacultyByFacultyId from "@/hooks/useActiveFacultyByFacultyId";
import useContentSpecialist from "@/hooks/useContentSpecialist";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ContentSpecialistPage() {
  const router = useRouter();
  const contentSpecialistId = router.query.id;
  const contentSpecialist = useContentSpecialist({
    id: contentSpecialistId as string,
  });
  const activeFaculty = useActiveFacultyByFacultyId({
    id: contentSpecialist?.facultyId,
  });
  const activeContentSpecialist =
    useActiveContentSpecialistByContentSpecialistId({
      id: contentSpecialistId as string,
    });

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

  const activateHandler = async () => {
    return axios
      .post(`/api/active_content_specialist`, {
        activeFacultyId: activeFaculty?.id,
      })
      .then(() => {
        alert("ContentSpecialist has been activated successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      })
      .finally(() => {
        router.reload();
      });
  };

  const deactivateHandler = async () => {
    return axios
      .delete(`/api/active_content_specialist/${activeContentSpecialist?.id}`)
      .then(() => {
        alert("ContentSpecialist has been deactivated successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      })
      .finally(() => {
        router.reload();
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
      {!activeContentSpecialist && (
        <button className='border rounded' onClick={activateHandler}>
          Activate
        </button>
      )}

      {activeContentSpecialist && (
        <button className='border rounded' onClick={deactivateHandler}>
          Deactivate
        </button>
      )}
    </AdminLayout>
  );
}
