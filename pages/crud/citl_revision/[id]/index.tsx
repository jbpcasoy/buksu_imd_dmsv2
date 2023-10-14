import CrudLayout from "@/components/CrudLayout";
import useCITLRevision from "@/hooks/useCITLRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CITLRevisionPage() {
  const router = useRouter();
  const cITLRevisionId = router.query.id;
  const cITLRevision = useCITLRevision({
    id: cITLRevisionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/citl_revision/${cITLRevisionId}`)
      .then(() => {
        alert("CITLRevision deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!cITLRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>CITLRevision</h2>
        <div className='space-x-1'>
          <Link
            href={`/crud/citl_revision/${cITLRevision.id}/edit`}
            className='rounded border'
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {cITLRevision.id}</p>
      <p>
        createdAt: {new Date(cITLRevision.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(cITLRevision.updatedAt).toLocaleString()}
      </p>
      <p>
        iMFileId:{" "}
        <Link
          href={`/crud/im_file/${cITLRevision.iMFileId}`}
          className='underline'
        >
          {cITLRevision.iMFileId}
        </Link>
      </p>
      <p>
      submittedIDDCoordinatorSuggestionId:{" "}
        <Link
          href={`/crud/submitted_idd_coordinator_suggestion/${cITLRevision.submittedIDDCoordinatorSuggestionId}`}
          className='underline'
        >
          {cITLRevision.submittedIDDCoordinatorSuggestionId}
        </Link>
      </p>
      <p>returned: {cITLRevision.returned ? "Yes" : "No"}</p>
    </CrudLayout>
  );
}
