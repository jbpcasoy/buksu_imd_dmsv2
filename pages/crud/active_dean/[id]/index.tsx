import CrudLayout from "@/components/CrudLayout";
import useActiveDean from "@/hooks/useActiveDean";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveDeanPage() {
  const router = useRouter();
  const activeDeanId = router.query.id;
  const activeDean = useActiveDean({ id: activeDeanId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/active_dean/${activeDeanId}`)
      .then(() => {
        alert("ActiveDean deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!activeDean) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ActiveDean</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {activeDean.id}</p>
      <p>createdAt: {new Date(activeDean.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(activeDean.updatedAt).toLocaleString()}</p>
      <p>
        deanId:{" "}
        <Link
          href={`/crud/dean/${activeDean.deanId}`}
          className='underline'
        >
          {activeDean.deanId}
        </Link>
      </p>
    </CrudLayout>
  );
}
