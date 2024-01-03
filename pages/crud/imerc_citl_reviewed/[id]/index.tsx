import CrudLayout from "@/components/CrudLayout";
import useIMERCCITLReviewed from "@/hooks/useIMERCCITLReviewed";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IMERCCITLReviewedPage() {
  const router = useRouter();
  const iMERCCITLReviewedId = router.query.id;
  const iMERCCITLReviewed = useIMERCCITLReviewed({
    id: iMERCCITLReviewedId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/imerc_citl_reviewed/${iMERCCITLReviewedId}`)
      .then(() => {
        alert("IMERCCITLReviewed has been deleted successfully");
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message);
      });
  };

  if (!iMERCCITLReviewed) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IMERCCITLReviewed</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iMERCCITLReviewed.id}</p>
      <p>createdAt: {new Date(iMERCCITLReviewed.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iMERCCITLReviewed.updatedAt).toLocaleString()}</p>
      <p>
        submittedContentEditorSuggestionId:
        <Link
          href={`/crud/submitted_content_editor_suggestion/${iMERCCITLReviewed.submittedContentEditorSuggestionId}`}
          className='underline'
        >
          {iMERCCITLReviewed.submittedContentEditorSuggestionId}
        </Link>
      </p>
      <p>
        submittedContentSpecialistSuggestionId:
        <Link
          href={`/crud/submitted_content_specialist_suggestion/${iMERCCITLReviewed.submittedContentSpecialistSuggestionId}`}
          className='underline'
        >
          {iMERCCITLReviewed.submittedContentSpecialistSuggestionId}
        </Link>
      </p>
      <p>
        submittedIDDSpecialistSuggestionId:
        <Link
          href={`/crud/submitted_idd_specialist_suggestion/${iMERCCITLReviewed.submittedIDDSpecialistSuggestionId}`}
          className='underline'
        >
          {iMERCCITLReviewed.submittedIDDSpecialistSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
