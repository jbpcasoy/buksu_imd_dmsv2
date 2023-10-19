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
        .delete(
          `/api/content_editor_suggestion_item/${contentEditorSuggestionItem.id}`
        )
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
    <tr className=''>
      <td>{contentEditorSuggestionItem.id}</td>
      <td>
        {new Date(contentEditorSuggestionItem.createdAt).toLocaleString()}
      </td>
      <td>
        {new Date(contentEditorSuggestionItem.updatedAt).toLocaleString()}
      </td>
      <td>{contentEditorSuggestionItem.suggestion}</td>
      <td>{contentEditorSuggestionItem.pageNumber}</td>
      <td>{contentEditorSuggestionItem.actionTaken}</td>
      <td>{contentEditorSuggestionItem.remarks}</td>
      <td>{contentEditorSuggestionItem.contentEditorSuggestionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/content_editor_suggestion_item/${contentEditorSuggestionItem.id}/edit`}
        >
          edit
        </Link>
        <button className='border rounded' onClick={handleDelete}>
          delete
        </button>
      </td>
    </tr>
  );
}
