import CrudLayout from "@/components/CrudLayout";
import useSubmittedContentEditorSuggestion from "@/hooks/useSubmittedContentEditorSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedContentEditorSuggestionPage() {
  const router = useRouter();
  const submittedContentEditorSuggestionId = router.query.id;
  const submittedContentEditorSuggestion = useSubmittedContentEditorSuggestion({
    id: submittedContentEditorSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/submitted_content_editor_suggestion/${submittedContentEditorSuggestionId}`)
      .then(() => {
        alert("SubmittedContentEditorSuggestion deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedContentEditorSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>SubmittedContentEditorSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedContentEditorSuggestion.id}</p>
      <p>
        createdAt:{" "}
        {new Date(submittedContentEditorSuggestion.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(submittedContentEditorSuggestion.updatedAt).toLocaleString()}
      </p>
      <p>
        contentEditorSuggestionId:{" "}
        <Link
          href={`/crud/content_editor_suggestion/${submittedContentEditorSuggestion.contentEditorSuggestionId}`}
          className='underline'
        >
          {submittedContentEditorSuggestion.contentEditorSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
