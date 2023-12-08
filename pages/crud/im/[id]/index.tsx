import CrudLayout from "@/components/CrudLayout";
import useIM from "@/hooks/useIM";
import useIMs from "@/hooks/useIMs";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function IMPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios.delete(`/api/im/${iMId}`).then(() => {
      alert("IM has been deleted successfully");
    }).catch(error => {
      alert(error.message)
    });
  };

  if (!iM) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IM</h2>
        <div className='space-x-1'>
          <Link className='border rounded' href={`/crud/im/${iMId}/edit`}>edit</Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iM.id}</p>
      <p>createdAt: {new Date(iM.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iM.updatedAt).toLocaleString()}</p>
      <p>title: {iM.title}</p>
      <p>type: {iM.type}</p>
      <p>facultyId: <Link href={`/crud/faculty/${iM.facultyId}`} className="underline">{iM.facultyId}</Link></p>
    </CrudLayout>
  );
}
