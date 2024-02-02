import CrudLayout from "@/components/CrudLayout";
import useCoAuthor from "@/hooks/useCoAuthor";
import useCoAuthors from "@/hooks/useCoAuthors";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CoAuthorPage() {
  const router = useRouter();
  const coAuthorId = router.query.id;
  const coAuthor = useCoAuthor({ id: coAuthorId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios.delete(`/api/co_author/${coAuthorId}`).then(() => {
      alert("CoAuthor has been deleted successfully");
    }).catch(error => {
      alert(error.response?.data?.error?.message)
    });
  };

  if (!coAuthor) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>CoAuthor</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {coAuthor.id}</p>
      <p>createdAt: {new Date(coAuthor.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(coAuthor.updatedAt).toLocaleString()}</p>
      <p>iMId: {coAuthor.iMId}</p>
    </CrudLayout>
  );
}
