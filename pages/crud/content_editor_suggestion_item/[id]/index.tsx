import CrudLayout from "@/components/CrudLayout";
import useContentEditorSuggestionItem from "@/hooks/useContentEditorSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ContentEditorSuggestionItemPage() {
  const router = useRouter();
  const contentEditorSuggestionItemId = router.query.id;
  const contentEditorSuggestionItem = useContentEditorSuggestionItem({
    id: contentEditorSuggestionItemId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/content_editor_suggestion_item/${contentEditorSuggestionItemId}`)
      .then(() => {
        alert("ContentEditorSuggestionItem has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!contentEditorSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ContentEditorSuggestionItem</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/content_editor_suggestion_item/${contentEditorSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {contentEditorSuggestionItem.id}</p>
      <p>
        createdAt: {new Date(contentEditorSuggestionItem.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(contentEditorSuggestionItem.updatedAt).toLocaleString()}
      </p>
      <p>
        contentEditorSuggestionId:{" "}
        <Link
          href={`/crud/content_editor_suggestion/${contentEditorSuggestionItem.contentEditorSuggestionId}`}
          className='underline'
        >
          {contentEditorSuggestionItem.contentEditorSuggestionId}
        </Link>
      </p>
      <p>suggestion: {contentEditorSuggestionItem.suggestion}</p>
      <p>pageNumber: {contentEditorSuggestionItem.pageNumber}</p>
      <p>actionTaken: {contentEditorSuggestionItem.actionTaken}</p>
      <p>remarks: {contentEditorSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
