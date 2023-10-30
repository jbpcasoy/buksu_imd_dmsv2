import AdminLayout from "@/components/AdminLayout";
import useActiveIDDCoordinatorByIDDCoordinatorId from "@/hooks/useActiveIDDCoordinatorByIDDCoordinatorId";
import useIDDCoordinator from "@/hooks/useIDDCoordinator";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDCoordinatorPage() {
  const router = useRouter();
  const iDDCoordinatorId = router.query.id;
  const iDDCoordinator = useIDDCoordinator({ id: iDDCoordinatorId as string });
  const activeIDDCoordinator = useActiveIDDCoordinatorByIDDCoordinatorId({
    id: iDDCoordinatorId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/iDDCoordinator/${iDDCoordinatorId}`)
      .then(() => {
        alert("IDDCoordinator deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  const activateHandler = async () => {
    return axios
      .post(`/api/active_idd_coordinator`, {
        iDDCoordinatorId,
      })
      .then(() => {
        alert("IDDCoordinator has been activated successfully");
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
      .delete(`/api/active_idd_coordinator/${activeIDDCoordinator?.id}`)
      .then(() => {
        alert("IDDCoordinator has been deactivated successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      })
      .finally(() => {
        router.reload();
      });
  };

  if (!iDDCoordinator) return null;

  return (
    <AdminLayout>
      <div className='flex'>
        <h2 className='flex-1'>IDDCoordinator</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iDDCoordinator.id}</p>
      <p>createdAt: {new Date(iDDCoordinator.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iDDCoordinator.updatedAt).toLocaleString()}</p>
      <p>
        userId:{" "}
        <Link
          href={`/admin/user/${iDDCoordinator.userId}`}
          className='underline'
        >
          {iDDCoordinator.userId}
        </Link>
      </p>
      {!activeIDDCoordinator && (
        <button className='border rounded' onClick={activateHandler}>
          Activate
        </button>
      )}

      {activeIDDCoordinator && (
        <button className='border rounded' onClick={deactivateHandler}>
          Deactivate
        </button>
      )}
    </AdminLayout>
  );
}
