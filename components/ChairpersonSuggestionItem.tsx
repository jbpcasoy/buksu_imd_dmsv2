import { ChairpersonSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface ChairpersonSuggestionItemProps {
  chairpersonSuggestionItem: ChairpersonSuggestionItem;
}
export default function ChairpersonSuggestionItem({
  chairpersonSuggestionItem,
}: ChairpersonSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/chairperson_suggestion_item/${chairpersonSuggestionItem.id}`
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
      <td>{chairpersonSuggestionItem.id}</td>
      <td>{new Date(chairpersonSuggestionItem.createdAt).toLocaleString()}</td>
      <td>{new Date(chairpersonSuggestionItem.updatedAt).toLocaleString()}</td>
      <td>{chairpersonSuggestionItem.suggestion}</td>
      <td>{chairpersonSuggestionItem.pageNumber}</td>
      <td>{chairpersonSuggestionItem.actionTaken}</td>
      <td>{chairpersonSuggestionItem.remarks}</td>
      <td>{chairpersonSuggestionItem.chairpersonSuggestionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/chairperson_suggestion_item/${chairpersonSuggestionItem.id}/edit`}
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
