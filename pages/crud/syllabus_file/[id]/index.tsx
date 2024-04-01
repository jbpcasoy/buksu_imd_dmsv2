import CrudLayout from "@/components/CrudLayout";
import useSyllabusFile from "@/hooks/useSyllabusFile";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SyllabusFilePage() {
  const router = useRouter();
  const syllabusFileId = router.query.id;
  const syllabusFile = useSyllabusFile({ id: syllabusFileId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/syllabus_file/${syllabusFileId}`)
      .then(() => {
        alert("SyllabusFile has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!syllabusFile) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">SyllabusFile</h2>
        <div className="space-x-1">
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {syllabusFile.id}</p>
      <p>createdAt: {new Date(syllabusFile.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(syllabusFile.updatedAt).toLocaleString()}</p>
      <p>
        syllabusId:{" "}
        <Link
          href={`/crud/syllabus/${syllabusFile.syllabusId}`}
          className="underline"
        >
          {syllabusFile.syllabusId}
        </Link>
      </p>
      <p>filename: {syllabusFile.filename}</p>
      <p>mimetype: {syllabusFile.mimetype}</p>
      <p>originalFilename: {syllabusFile.originalFilename}</p>
      <p>size: {syllabusFile.size}</p>
    </CrudLayout>
  );
}
