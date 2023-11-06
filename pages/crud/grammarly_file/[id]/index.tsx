import CrudLayout from "@/components/CrudLayout";
import useGrammarlyFile from "@/hooks/useGrammarlyFile";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function GrammarlyFilePage() {
  const router = useRouter();
  const grammarlyFileId = router.query.id;
  const grammarlyFile = useGrammarlyFile({ id: grammarlyFileId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/grammarly_file/${grammarlyFileId}`)
      .then(() => {
        alert("GrammarlyFile deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!grammarlyFile) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>GrammarlyFile</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {grammarlyFile.id}</p>
      <p>createdAt: {new Date(grammarlyFile.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(grammarlyFile.updatedAt).toLocaleString()}</p>
      <p>
        iMId:{" "}
        <Link href={`/crud/im/${grammarlyFile.iMId}`} className='underline'>
          {grammarlyFile.iMId}
        </Link>
      </p>
      <p>filename: {grammarlyFile.filename}</p>
      <p>mimetype: {grammarlyFile.mimetype}</p>
      <p>originalFilename: {grammarlyFile.originalFilename}</p>
      <p>size: {grammarlyFile.size}</p>
    </CrudLayout>
  );
}
