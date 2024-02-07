import CrudLayout from "@/components/CrudLayout";
import useActiveCITLDirector from "@/hooks/useActiveCITLDirector";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveCITLDirectorPage() {
  const router = useRouter();
  const activeCITLDirectorId = router.query.id;
  const activeCITLDirector = useActiveCITLDirector({ id: activeCITLDirectorId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/active_citl_director/${activeCITLDirectorId}`)
      .then(() => {
        alert("ActiveCITLDirector has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!activeCITLDirector) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ActiveCITLDirector</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {activeCITLDirector.id}</p>
      <p>createdAt: {new Date(activeCITLDirector.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(activeCITLDirector.updatedAt).toLocaleString()}</p>
      <p>
        cITLDirectorId:{" "}
        <Link
          href={`/crud/cITLDirector/${activeCITLDirector.cITLDirectorId}`}
          className='underline'
        >
          {activeCITLDirector.cITLDirectorId}
        </Link>
      </p>
    </CrudLayout>
  );
}
