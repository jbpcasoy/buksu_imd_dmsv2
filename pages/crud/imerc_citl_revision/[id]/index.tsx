import CrudLayout from "@/components/CrudLayout";
import useIMERCCITLRevision from "@/hooks/useIMERCCITLRevision";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IMERCCITLRevisionPage() {
  const router = useRouter();
  const iMERCCITLRevisionId = router.query.id;
  const iMERCCITLRevision = useIMERCCITLRevision({
    id: iMERCCITLRevisionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/imerc_citl_revision/${iMERCCITLRevisionId}`)
      .then(() => {
        alert("IMERCCITLRevision deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iMERCCITLRevision) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IMERCCITLRevision</h2>
        <div className='space-x-1'>
          <Link
            href={`/crud/imerc_citl_revision/${iMERCCITLRevision.id}/edit`}
            className='rounded border'
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iMERCCITLRevision.id}</p>
      <p>createdAt: {new Date(iMERCCITLRevision.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iMERCCITLRevision.updatedAt).toLocaleString()}</p>
      <p>
        iMFileId:{" "}
        <Link
          href={`/crud/im_file/${iMERCCITLRevision.iMFileId}`}
          className='underline'
        >
          {iMERCCITLRevision.iMFileId}
        </Link>
      </p>
      <p>
        iMERCCITLReviewedId:{" "}
        <Link
          href={`/crud/imerc_citl_revieweded/${iMERCCITLRevision.iMERCCITLReviewedId}`}
          className='underline'
        >
          {iMERCCITLRevision.iMERCCITLReviewedId}
        </Link>
      </p>
    </CrudLayout>
  );
}
