import CrudLayout from "@/components/CrudLayout";
import useCITLDirector from "@/hooks/useCITLDirector";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CITLDirectorPage() {
  const router = useRouter();
  const cITLDirectorId = router.query.id;
  const cITLDirector = useCITLDirector({ id: cITLDirectorId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/citl_director/${cITLDirectorId}`)
      .then(() => {
        alert("CITLDirector has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!cITLDirector) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>CITLDirector</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {cITLDirector.id}</p>
      <p>createdAt: {new Date(cITLDirector.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(cITLDirector.updatedAt).toLocaleString()}</p>
      <p>
        userId:{" "}
        <Link href={`/crud/user/${cITLDirector.userId}`} className='underline'>
          {cITLDirector.userId}
        </Link>
      </p>
    </CrudLayout>
  );
}
