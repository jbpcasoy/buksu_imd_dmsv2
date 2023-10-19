import { ContentSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface ContentSpecialistSuggestionItemProps {
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
}
export default function ContentSpecialistSuggestionItem({
  contentSpecialistSuggestionItem,
}: ContentSpecialistSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/content_specialist_suggestion_item/${contentSpecialistSuggestionItem.id}`
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
      <td>{contentSpecialistSuggestionItem.id}</td>
      <td>
        {new Date(contentSpecialistSuggestionItem.createdAt).toLocaleString()}
      </td>
      <td>
        {new Date(contentSpecialistSuggestionItem.updatedAt).toLocaleString()}
      </td>
      <td>{contentSpecialistSuggestionItem.suggestion}</td>
      <td>{contentSpecialistSuggestionItem.pageNumber}</td>
      <td>{contentSpecialistSuggestionItem.actionTaken}</td>
      <td>{contentSpecialistSuggestionItem.remarks}</td>
      <td>{contentSpecialistSuggestionItem.contentSpecialistSuggestionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/content_specialist_suggestion_item/${contentSpecialistSuggestionItem.id}/edit`}
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
