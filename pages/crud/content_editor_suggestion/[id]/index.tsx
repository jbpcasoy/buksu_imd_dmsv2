import CrudLayout from "@/components/CrudLayout";
import useContentEditorSuggestion from "@/hooks/useContentEditorSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ContentEditorSuggestionPage() {
  const router = useRouter();
  const contentEditorSuggestionId = router.query.id;
  const contentEditorSuggestion = useContentEditorSuggestion({ id: contentEditorSuggestionId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/content_editor_suggestion/${contentEditorSuggestionId}`)
      .then(() => {
        alert("ContentEditorSuggestion has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!contentEditorSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ContentEditorSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {contentEditorSuggestion.id}</p>
      <p>createdAt: {new Date(contentEditorSuggestion.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(contentEditorSuggestion.updatedAt).toLocaleString()}</p>
      <p>
      contentEditorReviewId:{" "}
        <Link
          href={`/crud/content_editor_review/${contentEditorSuggestion.contentEditorReviewId}`}
          className='underline'
        >
          {contentEditorSuggestion.contentEditorReviewId}{" "}
        </Link>
      </p>
    </CrudLayout>
  );
}
