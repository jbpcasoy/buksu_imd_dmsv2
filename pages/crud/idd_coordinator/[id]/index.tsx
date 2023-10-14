import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinator from "@/hooks/useIDDCoordinator";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDCoordinatorPage() {
  const router = useRouter();
  const iDDCoordinatorId = router.query.id;
  const iDDCoordinator = useIDDCoordinator({ id: iDDCoordinatorId as string });

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

  if (!iDDCoordinator) return null;

  return (
    <CrudLayout>
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
        <Link href={`/crud/user/${iDDCoordinator.userId}`} className='underline'>
          {iDDCoordinator.userId}
        </Link>
      </p>
    </CrudLayout>
  );
}
