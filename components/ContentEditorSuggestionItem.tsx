import { ContentEditorSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface ContentEditorSuggestionItemProps {
  contentEditorSuggestionItem: ContentEditorSuggestionItem;
}
export default function ContentEditorSuggestionItem({
  contentEditorSuggestionItem,
}: ContentEditorSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(`/api/content_editor_suggestion_item/${contentEditorSuggestionItem.id}`)
        .then(() => {
          alert("Suggestion deleted successfully");
          router.reload();
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to delete suggestion");
        });
    }
  };
  return (
    <div className='border rounded'>
      <p>suggestion: {contentEditorSuggestionItem.suggestion}</p>
      <p>pageNumber: {contentEditorSuggestionItem.pageNumber}</p>
      <p>remarks: {contentEditorSuggestionItem.remarks}</p>
      <div className='space-x-1'>
        <Link
          className='border rounded'
          href={`/content_editor_suggestion_item/${contentEditorSuggestionItem.id}/edit`}
        >
          edit
        </Link>
        <button className='border rounded' onClick={handleDelete}>
          delete
        </button>
      </div>
    </div>
  );
}
