import CrudLayout from "@/components/CrudLayout";
import useActiveIDDCoordinator from "@/hooks/useActiveIDDCoordinator";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveIDDCoordinatorPage() {
  const router = useRouter();
  const activeIDDCoordinatorId = router.query.id;
  const activeIDDCoordinator = useActiveIDDCoordinator({ id: activeIDDCoordinatorId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/active_idd_coordinator/${activeIDDCoordinatorId}`)
      .then(() => {
        alert("ActiveIDDCoordinator deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!activeIDDCoordinator) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ActiveIDDCoordinator</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {activeIDDCoordinator.id}</p>
      <p>createdAt: {new Date(activeIDDCoordinator.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(activeIDDCoordinator.updatedAt).toLocaleString()}</p>
      <p>
        iDDCoordinatorId:{" "}
        <Link
          href={`/crud/iDDCoordinator/${activeIDDCoordinator.iDDCoordinatorId}`}
          className='underline'
        >
          {activeIDDCoordinator.iDDCoordinatorId}
        </Link>
      </p>
    </CrudLayout>
  );
}
