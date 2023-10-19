import { CoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface CoordinatorSuggestionItemProps {
  coordinatorSuggestionItem: CoordinatorSuggestionItem;
}
export default function CoordinatorSuggestionItem({
  coordinatorSuggestionItem,
}: CoordinatorSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/coordinator_suggestion_item/${coordinatorSuggestionItem.id}`
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
      <td>{coordinatorSuggestionItem.id}</td>
      <td>{new Date(coordinatorSuggestionItem.createdAt).toLocaleString()}</td>
      <td>{new Date(coordinatorSuggestionItem.updatedAt).toLocaleString()}</td>
      <td>{coordinatorSuggestionItem.suggestion}</td>
      <td>{coordinatorSuggestionItem.pageNumber}</td>
      <td>{coordinatorSuggestionItem.actionTaken}</td>
      <td>{coordinatorSuggestionItem.remarks}</td>
      <td>{coordinatorSuggestionItem.coordinatorSuggestionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/coordinator_suggestion_item/${coordinatorSuggestionItem.id}/edit`}
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
