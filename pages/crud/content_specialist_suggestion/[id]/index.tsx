import CrudLayout from "@/components/CrudLayout";
import useContentSpecialistSuggestion from "@/hooks/useContentSpecialistSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ContentSpecialistSuggestionPage() {
  const router = useRouter();
  const contentSpecialistSuggestionId = router.query.id;
  const contentSpecialistSuggestion = useContentSpecialistSuggestion({ id: contentSpecialistSuggestionId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/content_specialist_suggestion/${contentSpecialistSuggestionId}`)
      .then(() => {
        alert("ContentSpecialistSuggestion deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!contentSpecialistSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ContentSpecialistSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {contentSpecialistSuggestion.id}</p>
      <p>createdAt: {new Date(contentSpecialistSuggestion.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(contentSpecialistSuggestion.updatedAt).toLocaleString()}</p>
      <p>
      contentSpecialistReviewId:{" "}
        <Link
          href={`/crud/content_specialist_review/${contentSpecialistSuggestion.contentSpecialistReviewId}`}
          className='underline'
        >
          {contentSpecialistSuggestion.contentSpecialistReviewId}{" "}
        </Link>
      </p>
    </CrudLayout>
  );
}
