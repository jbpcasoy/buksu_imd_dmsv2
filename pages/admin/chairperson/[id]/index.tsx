import AdminLayout from "@/components/AdminLayout";
import useActiveChairpersonByChairpersonId from "@/hooks/useActiveChairpersonByChairpersonId";
import useActiveFacultyByFacultyId from "@/hooks/useActiveFacultyByFacultyId";
import useChairperson from "@/hooks/useChairperson";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ChairpersonPage() {
  const router = useRouter();
  const chairpersonId = router.query.id;
  const chairperson = useChairperson({ id: chairpersonId as string });
  const activeFaculty = useActiveFacultyByFacultyId({
    id: chairperson?.facultyId,
  });
  const activeChairperson = useActiveChairpersonByChairpersonId({
    id: chairpersonId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/chairperson/${chairpersonId}`)
      .then(() => {
        alert("Chairperson deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  const activateHandler = async () => {
    return axios
      .post(`/api/active_chairperson`, {
        activeFacultyId: activeFaculty?.id,
      })
      .then(() => {
        alert("Chairperson has been activated successfully");
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
      .delete(`/api/active_chairperson/${activeChairperson?.id}`)
      .then(() => {
        alert("Chairperson has been deactivated successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      })
      .finally(() => {
        router.reload();
      });
  };

  if (!chairperson) return null;

  return (
    <AdminLayout>
      <div className='flex'>
        <h2 className='flex-1'>Chairperson</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {chairperson.id}</p>
      <p>createdAt: {new Date(chairperson.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(chairperson.updatedAt).toLocaleString()}</p>
      <p>
        facultyId:{" "}
        <Link
          href={`/admin/faculty/${chairperson.facultyId}`}
          className='underline'
        >
          {chairperson.facultyId}
        </Link>
      </p>
      {!activeChairperson && (
        <button className='border rounded' onClick={activateHandler}>
          Activate
        </button>
      )}

      {activeChairperson && (
        <button className='border rounded' onClick={deactivateHandler}>
          Deactivate
        </button>
      )}
    </AdminLayout>
  );
}
