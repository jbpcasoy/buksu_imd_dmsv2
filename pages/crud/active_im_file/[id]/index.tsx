import CrudLayout from "@/components/CrudLayout";
import useActiveIMFile from "@/hooks/useActiveIMFile";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveIMFilePage() {
  const router = useRouter();
  const activeIMFileId = router.query.id;
  const activeIMFile = useActiveIMFile({ id: activeIMFileId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/active_im_file/${activeIMFileId}`)
      .then(() => {
        alert("ActiveIMFile deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!activeIMFile) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ActiveIMFile</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {activeIMFile.id}</p>
      <p>createdAt: {new Date(activeIMFile.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(activeIMFile.updatedAt).toLocaleString()}</p>
      <p>
        iMFileId:{" "}
        <Link
          href={`/crud/im_file/${activeIMFile.iMFileId}`}
          className='underline'
        >
          {activeIMFile.iMFileId}
        </Link>
      </p>
    </CrudLayout>
  );
}
