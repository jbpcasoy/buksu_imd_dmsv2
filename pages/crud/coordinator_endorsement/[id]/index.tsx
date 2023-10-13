import CrudLayout from "@/components/CrudLayout";
import useCoordinatorEndorsement from "@/hooks/useCoordinatorEndorsement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CoordinatorEndorsementPage() {
  const router = useRouter();
  const coordinatorEndorsementId = router.query.id;
  const coordinatorEndorsement = useCoordinatorEndorsement({ id: coordinatorEndorsementId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/coordinator_endorsement/${coordinatorEndorsementId}`)
      .then(() => {
        alert("CoordinatorEndorsement deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!coordinatorEndorsement) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>CoordinatorEndorsement</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {coordinatorEndorsement.id}</p>
      <p>createdAt: {new Date(coordinatorEndorsement.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(coordinatorEndorsement.updatedAt).toLocaleString()}</p>
      <p>
      departmentRevisionId:{" "}
        <Link
          href={`/crud/department_revision/${coordinatorEndorsement.departmentRevisionId}`}
          className='underline'
        >
          {coordinatorEndorsement.departmentRevisionId}
        </Link>
      </p>
      <p>
      coordinatorId:{" "}
        <Link
          href={`/crud/coordinator/${coordinatorEndorsement.coordinatorId}`}
          className='underline'
        >
          {coordinatorEndorsement.coordinatorId}
        </Link>
      </p>
    </CrudLayout>
  );
}
