import AdminLayout from "@/components/AdminLayout";
import useActiveFacultyByFacultyId from "@/hooks/useActiveFacultyByFacultyId";
import useFaculty from "@/hooks/useFaculty";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function FacultyPage() {
  const router = useRouter();
  const facultyId = router.query.id;
  const faculty = useFaculty({ id: facultyId as string });
  const activeFaculty = useActiveFacultyByFacultyId({
    id: facultyId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/faculty/${facultyId}`)
      .then(() => {
        alert("Faculty deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  const activateHandler = async () => {
    return axios
      .post(`/api/active_faculty`, {
        facultyId,
      })
      .then(() => {
        alert("Faculty has been activated successfully");
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
      .delete(`/api/active_faculty/${activeFaculty?.id}`)
      .then(() => {
        alert("Faculty has been deactivated successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      })
      .finally(() => {
        router.reload();
      });
  };

  if (!faculty) return null;

  return (
    <AdminLayout>
      <div className='flex'>
        <h2 className='flex-1'>Faculty</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {faculty.id}</p>
      <p>createdAt: {new Date(faculty.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(faculty.updatedAt).toLocaleString()}</p>
      <p>
        userId:{" "}
        <Link href={`/admin/user/${faculty.userId}`} className='underline'>
          {faculty.userId}
        </Link>
      </p>
      <p>
        departmentId:{" "}
        <Link
          href={`/admin/department/${faculty.departmentId}`}
          className='underline'
        >
          {faculty.departmentId}
        </Link>
      </p>
      {!activeFaculty && (
        <button className='border rounded' onClick={activateHandler}>
          Activate
        </button>
      )}

      {activeFaculty && (
        <button className='border rounded' onClick={deactivateHandler}>
          Deactivate
        </button>
      )}
    </AdminLayout>
  );
}