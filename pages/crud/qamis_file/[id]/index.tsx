import CrudLayout from "@/components/CrudLayout";
import useQAMISFile from "@/hooks/useQAMISFile";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QAMISFilePage() {
  const router = useRouter();
  const qAMISFileId = router.query.id;
  const qAMISFile = useQAMISFile({ id: qAMISFileId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/qamis_file/${qAMISFileId}`)
      .then(() => {
        alert("QAMISFile deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!qAMISFile) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>QAMISFile</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {qAMISFile.id}</p>
      <p>createdAt: {new Date(qAMISFile.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(qAMISFile.updatedAt).toLocaleString()}</p>
      <p>
      submittedQAMISSuggestionId:{" "}
        <Link href={`/crud/submitted_qamis_suggestion/${qAMISFile.submittedQAMISSuggestionId}`} className='underline'>
          {qAMISFile.submittedQAMISSuggestionId}
        </Link>
      </p>
      <p>filename: {qAMISFile.filename}</p>
      <p>mimetype: {qAMISFile.mimetype}</p>
      <p>originalFilename: {qAMISFile.originalFilename}</p>
      <p>size: {qAMISFile.size}</p>
    </CrudLayout>
  );
}
