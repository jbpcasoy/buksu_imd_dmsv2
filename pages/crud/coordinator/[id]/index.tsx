import CrudLayout from "@/components/CrudLayout";
import useCoordinator from "@/hooks/useCoordinator";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CoordinatorPage() {
  const router = useRouter();
  const coordinatorId = router.query.id;
  const coordinator = useCoordinator({ id: coordinatorId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/coordinator/${coordinatorId}`)
      .then(() => {
        alert("Coordinator has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!coordinator) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">Coordinator</h2>
        <div className="space-x-1">
          <button className="border rounded" onClick={deleteHandler}>
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
          href={`/crud/faculty/${coordinator.facultyId}`}
          className="underline"
        >
          {coordinator.facultyId}
        </Link>
      </p>
    </CrudLayout>
  );
}
