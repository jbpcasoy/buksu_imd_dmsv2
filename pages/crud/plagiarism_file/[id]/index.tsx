import CrudLayout from "@/components/CrudLayout";
import usePlagiarismFile from "@/hooks/usePlagiarismFile";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PlagiarismFilePage() {
  const router = useRouter();
  const plagiarismFileId = router.query.id;
  const plagiarismFile = usePlagiarismFile({ id: plagiarismFileId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/plagiarism_file/${plagiarismFileId}`)
      .then(() => {
        alert("PlagiarismFile has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!plagiarismFile) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>PlagiarismFile</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {plagiarismFile.id}</p>
      <p>createdAt: {new Date(plagiarismFile.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(plagiarismFile.updatedAt).toLocaleString()}</p>
      <p>
        iMId:{" "}
        <Link href={`/crud/im/${plagiarismFile.iMId}`} className='underline'>
          {plagiarismFile.iMId}
        </Link>
      </p>
      <p>filename: {plagiarismFile.filename}</p>
      <p>mimetype: {plagiarismFile.mimetype}</p>
      <p>originalFilename: {plagiarismFile.originalFilename}</p>
      <p>size: {plagiarismFile.size}</p>
    </CrudLayout>
  );
}
