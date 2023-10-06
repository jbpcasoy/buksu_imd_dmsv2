import MainLayout from "@/components/MainLayout";
import useIM from "@/hooks/useIM";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

export default function ViewIM() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });

  const deleteHandler = (id: string) => {
    axios.delete(`/api/im/${id}`).then(() => {
      alert("IM deleted successfully");
    });
  };

  if (!iM) return null;

  return (
    <MainLayout>
      <div className="flex">
        <h2 className="flex-1">View IM</h2>

        <div >
          <button
            onClick={() => deleteHandler(iM.id)}
            className='border rounded'
          >
            delete
          </button>

          <Link href={`/im/${iM.id}/edit`} className='border rounded'>
            edit
          </Link>
        </div>
      </div>
      <p>id: {iM.id}</p>
      <p>createdAt: {new Date(iM.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iM.updatedAt).toLocaleString()}</p>
      <p>facultyId: {iM.facultyId}</p>
      <p>title: {iM.title}</p>
      <p>type: {iM.type}</p>
    </MainLayout>
  );
}
