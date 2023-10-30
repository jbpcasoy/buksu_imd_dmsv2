import AdminLayout from "@/components/AdminLayout";
import useActiveCoordinatorByCoordinatorId from "@/hooks/useActiveCoordinatorByCoordinatorId";
import useActiveFacultyByFacultyId from "@/hooks/useActiveFacultyByFacultyId";
import useCoordinator from "@/hooks/useCoordinator";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CoordinatorPage() {
  const router = useRouter();
  const coordinatorId = router.query.id;
  const coordinator = useCoordinator({ id: coordinatorId as string });
  const activeFaculty = useActiveFacultyByFacultyId({
    id: coordinator?.facultyId,
  });
  const activeCoordinator = useActiveCoordinatorByCoordinatorId({
    id: coordinatorId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/coordinator/${coordinatorId}`)
      .then(() => {
        alert("Coordinator deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  const activateHandler = async () => {
    return axios
      .post(`/api/active_coordinator`, {
        activeFacultyId: activeFaculty?.id,
      })
      .then(() => {
        alert("Coordinator has been activated successfully");
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
      .delete(`/api/active_coordinator/${activeCoordinator?.id}`)
      .then(() => {
        alert("Coordinator has been deactivated successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      })
      .finally(() => {
        router.reload();
      });
  };

  if (!coordinator) return null;

  return (
    <AdminLayout>
      <div className='flex'>
        <h2 className='flex-1'>Coordinator</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {coordinator.id}</p>
      <p>createdAt: {new Date(coordinator.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(coordinator.updatedAt).toLocaleString()}</p>
      <p>
        facultyId:{" "}
        <Link
          href={`/admin/faculty/${coordinator.facultyId}`}
          className='underline'
        >
          {coordinator.facultyId}
        </Link>
      </p>
      {!activeCoordinator && (
        <button className='border rounded' onClick={activateHandler}>
          Activate
        </button>
      )}

      {activeCoordinator && (
        <button className='border rounded' onClick={deactivateHandler}>
          Deactivate
        </button>
      )}
    </AdminLayout>
  );
}
