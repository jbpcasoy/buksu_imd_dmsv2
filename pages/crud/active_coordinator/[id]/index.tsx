import CrudLayout from "@/components/CrudLayout";
import useActiveCoordinator from "@/hooks/useActiveCoordinator";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveCoordinatorPage() {
  const router = useRouter();
  const activeCoordinatorId = router.query.id;
  const activeCoordinator = useActiveCoordinator({ id: activeCoordinatorId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/active_coordinator/${activeCoordinatorId}`)
      .then(() => {
        alert("ActiveCoordinator deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!activeCoordinator) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ActiveCoordinator</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {activeCoordinator.id}</p>
      <p>createdAt: {new Date(activeCoordinator.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(activeCoordinator.updatedAt).toLocaleString()}</p>
      <p>
        coordinatorId:{" "}
        <Link
          href={`/crud/coordinator/${activeCoordinator.coordinatorId}`}
          className='underline'
        >
          {activeCoordinator.coordinatorId}
        </Link>
      </p>
    </CrudLayout>
  );
}
