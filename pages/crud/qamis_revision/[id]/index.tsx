import CrudLayout from "@/components/CrudLayout";
import useQAMISRevision from "@/hooks/useQAMISRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QAMISRevisionPage() {
  const router = useRouter();
  const qAMISRevisionId = router.query.id;
  const qAMISRevision = useQAMISRevision({
    id: qAMISRevisionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/qamis_revision/${qAMISRevisionId}`)
      .then(() => {
        alert("QAMISRevision deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!qAMISRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>QAMISRevision</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {qAMISRevision.id}</p>
      <p>createdAt: {new Date(qAMISRevision.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(qAMISRevision.updatedAt).toLocaleString()}</p>
      <p>
        qAMISFileId:{" "}
        <Link
          href={`/crud/qamis_file/${qAMISRevision.qAMISFileId}`}
          className='underline'
        >
          {qAMISRevision.qAMISFileId}
        </Link>
      </p>
      <p>
        iMFileId:{" "}
        <Link
          href={`/crud/qamis_file/${qAMISRevision.iMFileId}`}
          className='underline'
        >
          {qAMISRevision.iMFileId}
        </Link>
      </p>
      <p>
        submittedQAMISSuggestionId:{" "}
        <Link
          href={`/crud/submitted_qamis_suggestion/${qAMISRevision.submittedQAMISSuggestionId}`}
          className='underline'
        >
          {qAMISRevision.submittedQAMISSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
