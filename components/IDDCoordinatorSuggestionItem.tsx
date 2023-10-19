import { IDDCoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface IDDCoordinatorSuggestionItemProps {
  iDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
}
export default function IDDCoordinatorSuggestionItem({
  iDDCoordinatorSuggestionItem,
}: IDDCoordinatorSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}`
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
      <td>{iDDCoordinatorSuggestionItem.id}</td>
      <td>
        {new Date(iDDCoordinatorSuggestionItem.createdAt).toLocaleString()}
      </td>
      <td>
        {new Date(iDDCoordinatorSuggestionItem.updatedAt).toLocaleString()}
      </td>
      <td>{iDDCoordinatorSuggestionItem.suggestion}</td>
      <td>{iDDCoordinatorSuggestionItem.pageNumber}</td>
      <td>{iDDCoordinatorSuggestionItem.actionTaken}</td>
      <td>{iDDCoordinatorSuggestionItem.remarks}</td>
      <td>{iDDCoordinatorSuggestionItem.iDDCoordinatorSuggestionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}/edit`}
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
